import AbstractComponent from "@components/abstract"
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import { ToggleButton, ToggleButtonGroup } from "@material-ui/core";

const MyRoleContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    }
`;

const myRole: React.FC = () => {
    console.log('rendering')
    return (
        <AbstractComponent>
            <MyRoleContainer>
                <ToggleButtonGroup value={1} exclusive style={{ width: '100%', alignItems:'center', justifyContent: 'center', marginBottom: '2rem' }} orientation="vertical">
                    <ToggleButton value={1} style={{ width: '100%', maxWidth: '440px' }}>
                        일반 회원
                    </ToggleButton>
                    <ToggleButton value={2} style={{ width: '100%', maxWidth: '440px' }}>
                        말씀 사역
                    </ToggleButton>
                    <ToggleButton value={3} style={{ width: '100%', maxWidth: '440px' }}>
                        찬양 사역
                    </ToggleButton>
                </ToggleButtonGroup>
            </MyRoleContainer>
        </AbstractComponent>
    )
}

export default myRole