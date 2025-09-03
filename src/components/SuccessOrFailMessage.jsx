import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

const anchorOrigin = { vertical: "bottom", horizontal: "right" };

export const SuccessOrFailMessage = ({
    open, 
    onClose, 
    severity = 'info', 
    message,
    autoHideDuration = 4000
}) => {
    return(
        <Snackbar 
            open={open} 
            autoHideDuration={autoHideDuration} 
            onClose={onClose} 
            anchorOrigin={anchorOrigin}
        >
            <Alert
                severity={severity}
                variant="filled"
                onClose={onClose}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}