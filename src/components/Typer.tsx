import { useCallback, useEffect, useReducer, useState } from "react";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import {
    typerStatsInitialState,
    typerStatsReducer,
} from "../reducers/typerStatsReducer";
import { classnames, countWords } from "../utils";
import { Letter, LetterState } from "./Letter";
import { ResultBlock } from "./ResultBlock";

export const Typer = () => {
    const [textData, setTextData] =
        useState<null | { text: string; wordsCount: number }>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stats, dispatchStatsEvent] = useReducer(
        typerStatsReducer,
        typerStatsInitialState
    );

    const startNewTest = useCallback(() => {
        fetch("https://api.quotable.io/random")
            .then((response) => response.json())
            .then((json) => {
                const text: string = json.content.replaceAll("  ", " ");
                const wordsCount = countWords(text);
                setTextData({ text, wordsCount });
                setCurrentIndex(0);
                dispatchStatsEvent({ type: "reset" });
            });
    }, []);

    useEffect(() => {
        startNewTest();
    }, [startNewTest]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!textData) return;

            event.preventDefault();

            const key = event.key;
            const currentLetter = textData?.text[currentIndex];

            if (stats.state !== "done") {
                if (key === currentLetter) {
                    setCurrentIndex(currentIndex + 1);

                    dispatchStatsEvent({
                        type: "next_letter",
                        isNextWord: key === " ",
                    });

                    if (currentIndex + 1 >= textData?.text.length) {
                        dispatchStatsEvent({ type: "stop" });
                    }
                } else {
                    dispatchStatsEvent({ type: "incorrect_letter" });
                }
            }

            if (key === "Enter") {
                setTextData(null);
                startNewTest();
            }
        },
        [textData, currentIndex, startNewTest, stats.state]
    );

    useEffect(() => {
        document.body.addEventListener("keypress", handleKeyDown);

        return () =>
            document.body.removeEventListener("keypress", handleKeyDown);
    }, [textData, handleKeyDown]);

    if (textData === null) {
        return (
            <SpinnerIcon className="w-40 m-auto text-secondary animate-spin" />
        );
    }

    const accuracy =
        currentIndex === 0
            ? 100
            : Math.round((currentIndex / stats.typedLetters) * 100);

    const endTime = stats.endTime || Date.now();
    const wpm =
        stats.startTime && endTime - stats.startTime > 100
            ? Math.round(
                  (stats.typedWords / (endTime - stats.startTime)) * 1000 * 60
              )
            : 0;

    const renderedLetters = textData.text.split("").map((letter, index) => {
        let state: LetterState = "not_typed";
        if (index < currentIndex) {
            state = "correct";
        } else if (index === currentIndex) {
            state = stats.lastCharacterIsIncorrect ? "incorrect" : "active";
        }

        return <Letter letter={letter} state={state} key={index} />;
    });

    return (
        <div className="w-full max-w-4xl px-4 m-auto text-3xl">
            {stats.state === "done" ? (
                <ResultBlock wpm={wpm} accuracy={accuracy} />
            ) : (
                <div className="flex flex-col gap-8">
                    <div
                        className={classnames(
                            "text-center text-8xl text-primary-500",
                            stats.state === "waiting"
                                ? "opacity-0"
                                : "animate-appear-fast"
                        )}
                    >
                        {stats.typedWords}/{textData.wordsCount}
                    </div>
                    <div className="font-mono">{renderedLetters}</div>
                    <div
                        className={classnames(
                            "text-center text-8xl text-primary-500",
                            stats.state === "waiting"
                                ? "opacity-0"
                                : "animate-appear-fast"
                        )}
                    >
                        {wpm} {accuracy}%
                    </div>
                </div>
            )}
        </div>
    );
};
