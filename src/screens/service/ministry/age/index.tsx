import AbstractComponent from "@components/abstract"
import { Body } from "@components/body/style"
import Header from "@components/header"
import { IParam, IProps } from "@interfaces"
import GlobalStyle from "@styles/globalStyles"
import { HH2 } from '@components/text';
import { Checkbox, CircularProgress } from "@material-ui/core"
import { HFormControlLabel, HFormGroup } from "@components/checkbox/style"
import BottomComponent from "@components/bottom"
import { HButton } from "@components/button/styled"

const Age: React.FC<IProps> = props => {
    const { idx } = props.query as IParam;

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} back_url={`/service/ministry/location?idx=${idx}`}/>
            <Body>
            <HH2>
                초청 연령대는 어떻게 되나요?
            </HH2>
            <HFormGroup>
                <HFormControlLabel control={<Checkbox defaultChecked />} label="10대" />
                <HFormControlLabel control={<Checkbox />} label="20대" />
                <HFormControlLabel control={<Checkbox />} label="30대" />
                <HFormControlLabel control={<Checkbox />} label="40대 이상" />
                <HFormControlLabel control={<Checkbox />} label="전연령" />
            </HFormGroup>
            <BottomComponent state="single">
                    <HButton width="30%">
                        다음
                        {/* {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'} */}
                    </HButton>
                </BottomComponent>
            </Body>
        </AbstractComponent>
    )
}

export default Age