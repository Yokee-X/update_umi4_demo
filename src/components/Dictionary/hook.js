import { getDictionaries } from '@/services/system';
import { useRequest } from 'umi';

const useDictionary = ({ type, ...params }, key) => {
    return useRequest(() => getDictionaries({ type, ...params }), {
        formatResult: res => {
            const list = res.data || [];
            const map = {};
            list.forEach(item => {
                map[item.value] = item;
            });
            if (key) return map[key];
            return { list, map };
        },
        throwOnError: true
    });
};

export default useDictionary;
