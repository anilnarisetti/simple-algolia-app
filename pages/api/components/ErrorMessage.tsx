interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;
    return (
        <div style={{color: 'red', paddingTop: '16px'}}>
            <h6>{message}</h6>
        </div>
    );
};

export default ErrorMessage;