import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import styles from './index.less';

const ScrollingTable = ({ scrollHeight, speed = 500, ...rest }) => {
    const containerRef = useRef();
    const tableRef = useRef(null);
    const requestScrollTimer = useRef(null);
    const [canScrollingHeight, setCanScrollingHeight] = useState({height:0});

    useEffect(() => {
        endScrollInterval();
        if (containerRef.current) {
            tableRef.current = containerRef.current.querySelector('table');
            const tableContainer = tableRef.current.parentElement.parentElement;
            tableContainer.style.height = scrollHeight + 'px';
            let canScrollingHeight = 0;
            const thead = tableRef.current.querySelector('thead');
            const tbody = tableRef.current.querySelector('tbody');
            // tableRef.current.removeChild(thead);
            tableRef.current.appendChild(thead);
            if (tbody.clientHeight > 0) {
                const viewHeight = tableContainer.clientHeight - thead.clientHeight;
                canScrollingHeight = tbody.clientHeight - viewHeight;
            }
            setCanScrollingHeight({height:canScrollingHeight});
        }
    }, [containerRef, rest.dataSource, rest.columns,rest.loading]);

    const startScrollInterval = (tbody) => {
        let scrolling = 0;
        requestScrollTimer.current = setInterval(() => {
            scrolling += 10;
            if (scrolling > canScrollingHeight.height) scrolling = canScrollingHeight.height;
            tbody.style.transition = `transform ${speed}ms linear`;
            tbody.style.transform = `translateY(${-scrolling}px)`;
            if (scrolling === canScrollingHeight.height) {
                scrolling = 0;
                tbody.style.transition = '';
                tbody.style.transform = '';
            }
        }, speed);
    };
    const endScrollInterval = () => {
        if (requestScrollTimer.current) {
            clearInterval(requestScrollTimer.current);
        }
    };
    useEffect(() => {
        endScrollInterval();
        const tbody = tableRef.current.querySelector('tbody');
        if (canScrollingHeight.height <= 0) {
            tbody.style.transition = '';
            tbody.style.transform = '';
        } else {
            const thead = tableRef.current.querySelector('thead');
            startScrollInterval(tbody);
        }
        return () => {
            endScrollInterval();
        };
    }, [canScrollingHeight]);

    return (
        <div className={styles.container} ref={containerRef}>
            <Table
                {...rest}
            />
        </div>
    );
};

export default ScrollingTable;
