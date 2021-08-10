import { ImageItem, ImageList, StyledImg } from './style';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

export const Handle = SortableHandle(({ src }) => {
    return <StyledImg src={src} />;
});

export const SortableItem = SortableElement(props => {
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

export const SortableList = SortableContainer(props => {
    const { items, ...restProps } = props;
    return (
        <ImageList>
            {(items as any).map((item, index) => (
                <SortableItem key={`item-${index}`} index={index} main={index === 0} value={item.m_size ? item.domain + item.m_size : item.domain + item.origin} {...restProps} />
            ))}
        </ImageList>
    );
});
