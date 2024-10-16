export default {
    namespace: 'relevanceProperty',
    state: {
        selectKey: [],
        selectList: [],
    },
    reducers: {
        update(state, { payload }) {
            let arr = []
            let obj = {}
            let list =[...state.selectList,...payload.selectList]
            for(let i in list){
               let item = list[i]
               if(!obj[item.assetId]){
                   obj[item.assetId] = i
               }
            }
            for(let j in payload.selectKey){
                arr.push(list[obj[payload.selectKey[j]]])
            }
            return {
                ...state,
                selectList: arr,
                selectKey: payload.selectKey,
            };
        },
        reset(state, { payload }) {
            return {
                ...state,
                selectKey: [],
                selectList: [],
            };
        },
    },
};
