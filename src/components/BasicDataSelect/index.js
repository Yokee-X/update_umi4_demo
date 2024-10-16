import React from 'react';
import BaseDataSelect from './BaseDataSelect';
import { getBrands, getModels, getSubModels, getModelDevices } from '@/services/cars';
import { getLeaderGroup } from '@/services/safeMonitor';
import { getUsers, getDictTypes, getRoles } from '@/services/system';
import { getEventCategories } from '@/services/strategy';
import { getVulnType } from '@/services/vulnerabilitys';
import { getComplexAttackConfigBasic } from '@/services/relevanceAnalysis';
import { getUpgradeRange } from '@/services/upgrade';

// 车品牌表
export class CarBrandsSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} showAll {...this.props} action={getBrands} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 车型列表
export class CarModelsSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} showAll {...this.props} action={getModels} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 车型项目列表
export class CarSubModelsSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} showAll {...this.props} action={getSubModels} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 事件类型列表
export class EventCategoriesSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} {...this.props} showAll fetchOnSearch={false} action={getEventCategories} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}

// 工单处理人列表
export class WoUsersSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} dataPropName={'users'} action={getUsers} showAll fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} {...this.props} />;
    }
}
//漏洞类型列表
export class VulnTypeSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} {...this.props} showAll action={getVulnType} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
//字典类型列表
export class DictTypeSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'type'} valueKey={'type'} {...this.props} showAll action={getDictTypes} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
//获取小组列表
export class LeaderSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} action={getLeaderGroup} {...this.props} showAll fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 车型项目列表
export class ModelDevicesSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'id'} {...this.props} showAll action={getModelDevices} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 升级范围列表
export class UpgradeRangeSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'rangeName'} valueKey={'id'} showAll {...this.props} action={getUpgradeRange} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
// 获取攻击列表
export class ComplexAttackBasicSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} valueKey={'name'} {...this.props} showAll fetchOnSearch={false} action={getComplexAttackConfigBasic} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} />;
    }
}
//获取角色列表
export class RoleSelect extends React.Component {
    render() {
        return <BaseDataSelect labelKey={'name'} dataPropName={'roles'} valueKey={'id'} action={getRoles} fetchOnSearch={false} filterOption={(input, option) => option.props.children.toLowerCase && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} {...this.props} />;
    }
}
