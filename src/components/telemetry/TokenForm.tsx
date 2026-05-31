/*

MIT License

Copyright (c) 2026 HumberASV
Copyright (c) 2026 Carson Fujita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useDispatch } from "react-redux";
import { setToken } from "../../utils/store/telemetrySlice";
import {
  Box,
  Button,
  useTheme,
  alpha,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TokenForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const [inputToken, setInputToken] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextToken = inputToken.trim();

        if (!nextToken) {
            return;
        }

        dispatch(setToken(nextToken));
        
        console.log("Submitted Token:", nextToken);

        // TODO(Carson): Implement actual connection logic to the basestation using the token

        //route to telemetry page
        navigate(`/connect/${nextToken}`);   
    }
    return (
        <Box
         component="form"
         onSubmit={handleSubmit}
         sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            padding: theme.spacing(4),
        }}>
            <TextField
                label="Enter Token"
                variant="outlined"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                sx={{ marginBottom: theme.spacing(2), width: '300px' }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

export default TokenForm;