import { Popover } from 'antd';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';

const MAX_WIDHT = 500;
const MAX_HEIGHT = 500;

function isPositiveInteger(num) {
    if (num === null || num === undefined) return true;
    if (typeof num !== 'number') return false;
    return /^\d+$/.test(num);
}

function isDomOverview(ref, isLines) {
    if (!ref) return true;
    const node = ref.current;
    const { scrollWidth, clientWidth, clientHeight, scrollHeight } = node;
    return isLines ? scrollHeight > clientHeight : scrollWidth > clientWidth;
}

function getMaxWidthHeight(ref) {
    const node = ref.current;
    if (!node) return;
    const { top, left, bottom, right } = node.getBoundingClientRect();
    const domBottom = window.innerHeight - bottom;
    const domRight = window.innerWidth - right;
    let placement = undefined;
    const result = { size: { x: window.innerWidth - left - 20, y: top - 50 } };
    if (domRight < 100) {
        placement = 'left';
    }
    if (left < 100) {
        placement = 'right';
    }
    if (domBottom < 100) {
        placement = 'topLeft';
        result.size.y = top - 50;
    }
    if (top < 100) {
        placement = 'bottomLeft';
        result.size.y = domBottom - 50;
    }
    if (placement) {
        result.relPlacement = placement;
    }
    return result;
}

const PopverTemp = props => (
    <Popover placement={props.currentPlacement || props.placement} autoAdjustOverflow={false} title={props.title} overlayInnerStyle={props.overlayInnerStyle} content={props.content || props.popChildren || props.children} open={props.open}>
        {props.children}
    </Popover>
);

function Index({ children, length = 0, lines = 0, style = null, title = null, content = null, className = '', leaveTime = 100, placement = 'topLeft', ...restProps }) {
    if (!isPositiveInteger(length) || !isPositiveInteger(lines)) {
        throw new Error('传入 length/lines 的值必须是正整数');
    }
    if (length && typeof children !== 'string') {
        throw new Error('传入 length 的时候 children(子组件) 必须是字符串');
    }
    if (length && lines) {
        console.warn('length 和 lines 同时传入时只有 length 会生效');
    }

    const ref = useRef();
    const lengthRef = useRef();
    const leaveTimer = useRef();
    const [isOverview, setIsOverview] = useState(false);
    const [open, setOpen] = useState(false);
    const [maxSize, setMaxSize] = useState({ x: 0, y: 0 });
    const [currentPlacement, setCurrentPlacement] = useState(placement);

    const id = `popover-auto-lines-${`${new Date().getTime()}${Math.floor(Math.random() * 100)}`}`;
    const lineStyle = lines ? `#${id}{-webkit-line-clamp:${lines};white-space:normal;-webkit-box-orient: vertical;display:-webkit-box;line-height:1.5rem;max-height:${lines * 1.5}rem}` : '.popover-auto-lines{}';
    const commonDependences = [children, style, className, restProps, title, content, open, currentPlacement];
    const overlayInnerStyle = { overflow: 'auto', maxHeight: `${Math.min(maxSize.y, MAX_HEIGHT) || MAX_HEIGHT}px`, maxWidth: `${Math.min(maxSize.x, MAX_WIDHT) || MAX_WIDHT}px`, minWidth: '50px', minHeight: '50px' };
    const templateCommonProps = { title, placement, overlayInnerStyle, content };

    const enter = e => {
        if (leaveTimer.current) {
            clearTimeout(leaveTimer.current);
        }
        const { size, relPlacement } = getMaxWidthHeight(e);
        setCurrentPlacement(relPlacement);
        setMaxSize(size);
        setOpen(true);
    };

    const leave = () => {
        if (leaveTimer.current) {
            clearTimeout(leaveTimer.current);
        }
        leaveTimer.current = setTimeout(() => {
            setOpen(false);
        }, leaveTime);
    };

    const lengthDom = useMemo(
        () =>
            length ? (
                <div ref={lengthRef} style={style} className={`${styles.domLength} ${className}`} onMouseEnter={() => enter(lengthRef)} onMouseLeave={() => leave()} {...restProps}>
                    <PopverTemp {...templateCommonProps} currentPlacement={currentPlacement} open={open} popChildren={children}>
                        {children ? children?.slice(0, length) + '...' : ''}
                    </PopverTemp>
                </div>
            ) : null,
        [length, ...commonDependences]
    );

    const autoDom = useMemo(
        () => (
            <div id={id} ref={ref} style={style} className={`${styles.domEllipsis} ${className}`} onMouseEnter={() => enter(ref)} onMouseLeave={() => leave()} {...restProps}>
                <style>{lineStyle}</style>
                <PopverTemp {...templateCommonProps} currentPlacement={currentPlacement} open={open && isOverview}>
                    {children}
                </PopverTemp>
            </div>
        ),
        [isOverview, lineStyle, ...commonDependences]
    );

    useEffect(() => {
        if (children && !length) {
            setIsOverview(isDomOverview(ref, lines));
        }
    }, [length, children, lines]);

    return length ? lengthDom : autoDom;
}

export default memo(Index);
