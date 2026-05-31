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
import { SetToken, GetToken} from "../../utils/store/tokenSlice";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  TextField,
} from "@mui/material";

const TelemetryGUI: React.FC = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.token.token);
    const theme = useTheme();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        dispatch(SetToken(token));
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
                value={token}
                onChange={(e) => dispatch(SetToken(e.target.value))}
                sx={{ marginBottom: theme.spacing(2), width: '300px' }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

export default TelemetryGUI;