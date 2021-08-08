import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import Container from '@material-ui/core/Container';
import { NextPageContext } from 'next';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styled, { css } from 'styled-components';
import { common } from '@definitions/styled-components';
import arrayMove from 'array-move';
import { useState, useRef, Fragment } from 'react';
import { HButton } from '@components/button/styled';
import BottomComponent from '@components/bottom';
import { DocumentNode, gql, useMutation } from '@apollo/client';

export const getServerSideProps = (context: NextPageContext) => {
    const { idx, level } = context.query;
    if (!(idx && level)) {
        context.res?.writeHead(301, {
            Location: '/'
        });
        context.res?.end();
    }
    return {
        props: {
            query: context.query,
            params: {}
        }
    };
};

const ImageItem = styled.div`
    list-style-type: none;
    float: left;
    width: 50%;
    div {
        position: relative;
        span {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #000;
            color: #fff;
            padding: 6px;
            border-radius: 100%;
            font-weight: 400;
            font-size: 14px;
        }
        div {
            position: absolute;
            bottom: 12px;
            right: 12px;
            button {
                font-size: 13px;
                padding: 4px 6px;
                font-weight: 500;
                cursor: pointer;
                background: #fff;
                color: ${({ theme }) => theme.colors.lightGrey};
                border: 1px solid ${({ theme }) => theme.colors.lightGrey};
            }
        }
    }
`;

const StyledImg = styled.img`
    display: block;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    padding: 0.125rem;
    &:hover {
        cursor: grab;
    }
`;

const ImageContainer = styled(Container)`
    ${() => css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
    `}
`;

const ImageDropArea = styled.label`
    ${({ theme }) => css`
        width: 100%;
        background: #fff;
        border: 2px dashed rgba(160, 174, 192, 0.75);
        height: 200px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        border-radius: 8px;
        margin-bottom: 16px;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
    `}
`;

const ImageList = styled.ul`
    ${({ theme }) => css`
        display: inline-block;
        background-color: #f8f9fc;
        white-space: nowrap;
        border-radius: 8px;
        width: 100%;
        padding: 0.125rem;
    `}
`;

const Handle = SortableHandle(({ src }) => {
    return <StyledImg src={src} />;
});

const SortableItem = SortableElement(props => {
    const { value, main } = props;
    return (
        <ImageItem>
            <div>
                {main && <span>대표</span>}
                <div>
                    <button>삭제</button>
                </div>
                {props.shouldUseDragHandle && <Handle src={value} />}
            </div>
        </ImageItem>
    );
});

const SortableList = SortableContainer(props => {
    const { items, ...restProps } = props;
    return (
        <ImageList>
            {(items as any).map((item, index) => (
                <SortableItem key={`item-${index}`} index={index} main={index === 0} value={item} {...restProps} />
            ))}
        </ImageList>
    );
});

interface IParam {
    idx: number;
    level: number;
}

interface IProps {
    query: IParam;
    params: object;
}

export const SET_IMAGES: DocumentNode = gql`
    mutation setImages($idx: Int!, $images: [Upload!]!) {
        setImages(idx: $idx, images: $images) {
            status
            token
            errors {
                code
                var
                text
            }
        }
    }
`;

const Image = (props: IProps) => {
    const { idx } = props.query as IParam;

    const [images, setImages] = useState([
        'https://d3edy9y3v7d67c.cloudfront.net/rooms/5486/images/960/i37394.jpg',
        'https://d3edy9y3v7d67c.cloudfront.net/rooms/10651/images/480/i85597.jpeg',
        'https://d3edy9y3v7d67c.cloudfront.net/rooms/10651/images/480/i85597.jpeg'
    ]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const tempData = arrayMove(images, oldIndex, newIndex);
        setImages(tempData);
    };

    const fileElement = useRef<HTMLInputElement>(null);
    const [attachment, setAttachment] = useState<Array<string>>([]);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const {
            target: { files }
        } = event;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const theFile = files[i];
                const reader = new FileReader();
                reader.onloadend = () => {
                    // const {
                    //     currentTarget: { result }
                    // } = finishedEvent;
                    setAttachment(prev => [...prev, reader.result as string]);
                };

                if (Boolean(theFile)) {
                    reader.readAsDataURL(theFile);
                }
            }
        }
    };

    const [func, result] = useMutation(SET_IMAGES);

    const onClickUpload = () => {
        // 파일 업로드 로직
        if (fileElement.current?.files) {
            const imageArray = new Array();
            for (let i = 0; i < fileElement.current.files.length; i++) {
                imageArray.push(fileElement.current.files[i]);
            }
            func({
                variables: {
                    idx: Number(idx),
                    images: imageArray
                }
            });
        }
    };

    const onClickSubmit = () => {
        // 정렬 완료하고 다음 페이지로
    };

    const onClickCancel = () => {
        // 첨부파일 취소
        if (fileElement.current) {
            fileElement.current.value = '';
            setAttachment([]);
        }
    };

    return (
        <AbstractComponent>
            <GlobalStyle />
            <ImageContainer>
                <SortableList shouldUseDragHandle useDragHandle axis="xy" items={images} onSortEnd={onSortEnd} />
                <ImageDropArea htmlFor="attach-file">
                    <input id="attach-file" ref={fileElement} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} multiple />
                    <div style={{ margin: 'auto', color: common.colors.lightGrey }}>사진 추가</div>
                </ImageDropArea>

                {attachment.length > 0 && (
                    <Fragment>
                        <ImageList>
                            {attachment.map((src, index) => (
                                <ImageItem key={index}>
                                    <div>
                                        <StyledImg src={src} />
                                    </div>
                                </ImageItem>
                            ))}
                        </ImageList>
                    </Fragment>
                )}
                <BottomComponent init={attachment.length > 0}>
                    {attachment.length > 0 ? (
                        <Fragment>
                            <HButton width="30%" onClick={onClickCancel}>
                                취소
                            </HButton>
                            <HButton width="30%" onClick={onClickUpload}>
                                올리기
                            </HButton>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <HButton width="30%">이전</HButton>
                            <HButton width="30%" onClick={onClickSubmit}>
                                다음
                            </HButton>
                        </Fragment>
                    )}
                </BottomComponent>
            </ImageContainer>
        </AbstractComponent>
    );
};

export default Image;
