const QuestionTypeRenderer = ({ question, answerOptions, type }) => {
    switch (type) {
        case 'text':
            return <input title="input some text" type="text" />;
        case 'boolean':
            return (
                <label>
                    <input type="radio" name={question} value="true" />Yes
                </label>
            );
        case 'single-select':
            return (
                <div>
                    {answerOptions.map((option, index) => (
                        <label key={index}>
                            <input type="radio" name={question} value={option} />
                            {option}
                        </label>
                    ))}
                </div>
            );
        case 'multi-select':
            return (
                <div>
                    {answerOptions.map((option, index) => (
                        <label key={index}>
                            <input type="checkbox" name={question} value={option} />
                            {option}
                        </label>
                    ))}
                </div>
            );
            // ... other question types

        default:
            return null;
    }
};

export default QuestionTypeRenderer;