import React from 'react';
import useDictionary from '@/components/Dictionary/hook';
import { Alert, Spin } from 'antd';

const DictionaryDisplay = ({type,name}) => {
    const {data,loading,error} = useDictionary({type});
    if(loading)return <Spin />
    if(error)return <Alert message={error.message} type={'error'} />
    return data?.map?.[name]?.label || '-';
};

export default DictionaryDisplay;
