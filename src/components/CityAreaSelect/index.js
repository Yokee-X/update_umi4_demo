import { Component } from 'react';
import { getAreas } from '@/services/basic';
import { Cascader } from 'antd';
import { injectIntl } from 'umi';
import { LoadingOutlined } from '@ant-design/icons';

class CityAreaSelect extends Component {
    state = {
        loading: false,
        options: []
    };
    UNSAFE_componentWillMount() {
        this.getAreas();
    }
    getAreas = () => {
        getAreas().then(res => {
            const provinceMap = {};
            const areas = (res.areas || []).sort((a, b) => (a.level > b.level ? 1 : -1));
            areas.forEach(item => {
                if (item.level == 1) {
                    provinceMap[item.id] = {
                        label: item.name,
                        value: item.id,
                        children: []
                    };
                } else {
                    provinceMap[item.parentId].children.push({
                        label: item.name,
                        value: item.id
                    });
                }
            });
            const options = Object.values(provinceMap);
            this.setState({ options });
        });
    };
    render() {
        const { loading, options } = this.state;
        const { intl } = props;
        return <Cascader placeholder={intl.formatMessage({ id: 'Common.placeholder.select' })} {...this.props} options={options} suffixIcon={loading ? <LoadingOutlined /> : null} />;
    }
}

export default injectIntl(CityAreaSelect);
