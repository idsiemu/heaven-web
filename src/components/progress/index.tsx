import { CircularProgress } from '@material-ui/core';

const Progress = () => {
    return (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%' }}>
            <CircularProgress />
        </div>
    );
};

export default Progress;
