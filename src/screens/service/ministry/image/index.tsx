import AbstractComponent from '@components/abstract';
import GlobalStyle from '@styles/globalStyles';
import { common } from '@definitions/styled-components';
import arrayMove from 'array-move';
import { useState, useRef, Fragment, useEffect } from 'react';
import { HButton } from '@components/button/styled';
import BottomComponent from '@components/bottom';
import { useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import { useCookie } from 'next-cookie';
import { TOKEN } from 'src/assets/utils/ENV';
import { ImageItem, StyledImg, ImageContainer, ImageDropArea, ImageList } from './style';
import { IProps, IParam } from '@interfaces';
import { SortableList } from './componets';
import { CHANGE_IMAGES_ORDER, DELETE_IMAGE, GET_IMAGES, SET_IMAGES } from './gql';
import { IDelParam, IImages, IObjectCover } from './type';
import Progress from '@components/progress';
import { HSnack, ISnack } from '@components/snackbar/styled';
import router from 'next/router';
import Header from '@components/header';
import { HH2 } from '@components/text';

const Image: React.FC<IProps> = props => {
    const { idx } = props.query as IParam;
    const [images, setImages] = useState<Array<IImages>>([]);
    const { loading, data, refetch } = useQuery<IObjectCover, { idx: number }>(GET_IMAGES, {
        variables: {
            idx: Number(idx)
        }
    });

    const [delIdx, setDelIdx] = useState({
        image_idx: 0,
        index: 0
    });

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const tempData = arrayMove(images, oldIndex, newIndex);
        setImages(tempData);
    };

    const [snack, setSnack] = useState<ISnack>({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
        message: ''
    });
    const { vertical, horizontal, open, message } = snack;

    const fileElement = useRef<HTMLInputElement>(null);
    const [attachment, setAttachment] = useState<Array<string>>([]);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const {
            target: { files }
        } = event;
        setAttachment([]);
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

    const [del, deleted] = useMutation(DELETE_IMAGE);

    const [changeOrder, ordered] = useMutation(CHANGE_IMAGES_ORDER);

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

    const onClickDelete = (selector: IDelParam) => {
        setDelIdx(selector);
        del({
            variables: {
                idx: selector.image_idx,
                orders: images.filter((im, index) => index !== selector.index).map((img, index) => ({ idx: img.idx, order_by: index }))
            }
        });
    };

    const onClickSubmit = () => {
        changeOrder({
            variables: {
                idx: Number(idx),
                orders: images.map((img, index) => ({ idx: img.idx, order_by: index }))
            }
        });
        // 정렬 완료하고 다음 페이지로
    };

    const onClickCancel = () => {
        // 첨부파일 취소
        if (fileElement.current) {
            fileElement.current.value = '';
            setAttachment([]);
        }
    };

    const onClickPrev = () => {
        router.push({
            pathname: '/service/ministry/brief',
            query: {
                idx
            }
        });
    };

    useEffect(() => {
        if (result.data) {
            const {
                setImages: { status, token, data, errors }
            } = result.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickUpload();
            } else if (status === 200) {
                if (fileElement.current) {
                    fileElement.current.value = '';
                    setAttachment([]);
                }
                setImages(prev => [...prev].concat(data));
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [result.data]);

    useEffect(() => {
        if (deleted.data) {
            const {
                deleteImage: { status, token, errors }
            } = deleted.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickDelete(delIdx);
            } else if (status === 200) {
                setImages(images.filter((im, index) => index !== delIdx.index));
                setDelIdx({
                    image_idx: 0,
                    index: 0
                });
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setDelIdx({
                        image_idx: 0,
                        index: 0
                    });
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [deleted.data]);

    useEffect(() => {
        if (ordered.data) {
            const {
                changeImagesOrder: { status, token, location, errors }
            } = ordered.data;
            if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, token, { path: '/' });
                onClickSubmit();
            } else if (status === 200) {
                router.push(`/service/${location}`);
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [ordered.data]);

    useEffect(() => {
        if (data) {
            const {
                getImages: { status, errors, ...rest }
            } = data;
            if (status === 200) {
                setImages(rest.data);
            } else if (status === 201) {
                const cookie = useCookie();
                cookie.set(TOKEN, rest.token, { path: '/' });
                refetch();
            } else if (errors) {
                let isBan = false;
                errors.forEach(err => {
                    if (err.code === '500-005') {
                        isBan = true;
                    }
                });
                if (isBan) {
                    router.push('/');
                } else {
                    setSnack(prev => ({ ...prev, open: true, message: errors[0].text ? errors[0].text : '' }));
                    setTimeout(() => setSnack(prev => ({ ...prev, message: '', open: false })), 2000);
                }
            }
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, []);

    if (loading) {
        return <Progress />;
    }

    return (
        <AbstractComponent>
            <GlobalStyle />
            <Header history={props.history} />
            <ImageContainer>
                <HH2>홍보 이미지</HH2>
                {images.length > 0 && <SortableList shouldUseDragHandle useDragHandle axis="xy" items={images} onSortEnd={onSortEnd} onClick={onClickDelete} />}
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
                <BottomComponent>
                    {attachment.length > 0 ? (
                        <Fragment>
                            <HButton width="30%" onClick={onClickCancel}>
                                취소
                            </HButton>
                            <HButton width="30%" onClick={onClickUpload}>
                                {result.loading ? <CircularProgress style={{ color: 'white' }} /> : '올리기'}
                            </HButton>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <HButton width="30%" onClick={onClickPrev}>
                                이전
                            </HButton>
                            <HButton width="30%" onClick={onClickSubmit}>
                                {ordered.loading ? <CircularProgress style={{ color: 'white' }} /> : '다음'}
                            </HButton>
                        </Fragment>
                    )}
                </BottomComponent>
                <HSnack anchorOrigin={{ vertical, horizontal }} open={open} message={message} />
            </ImageContainer>
        </AbstractComponent>
    );
};

export default Image;
