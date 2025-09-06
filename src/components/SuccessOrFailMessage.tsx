import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

const anchorOrigin: SnackbarOrigin = { vertical: "bottom", horizontal: "right" }

interface props{
    open: boolean,
    onClose: ()=> void,
    severity: 'error' | 'warning' | 'info' | 'success',
    message: string,
    autoHideDuration?: number
}

export const SuccessOrFailMessage = ({
    open, 
    onClose, 
    severity = 'info', 
    message,
    autoHideDuration = 4000
}: props) => {
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