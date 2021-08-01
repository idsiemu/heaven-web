import { CircularProgress } from '@material-ui/core';

const Progress = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </div>
    );
};

export default Progress;
