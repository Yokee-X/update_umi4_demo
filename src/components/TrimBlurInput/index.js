'use strict';
import { Input } from 'antd';
import { emojiReplace } from '@/utils';
import { Component } from 'react';
class TrimBlurInput extends Component {
    handleBlur = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value.trim()), evt);
    };
    handleChange = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value), evt);
    };
    render() {
        return <Input {...this.props} onChange={this.handleChange} onBlur={this.handleBlur} />;
    }
}
class Password extends Component {
    handleBlur = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value.trim()), evt);
    };
    handleChange = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value), evt);
    };
    render() {
        return <Input.Password {...this.props} onChange={this.handleChange} onBlur={this.handleBlur} />;
    }
}
class Search extends Component {
    state = {
        value: ''
    };
    componentDidMount() {
        if ('value' in this.props) {
            this.setState({ value: this.props.value });
        }
    }
    handleBlur = evt => {
        // const { onChange,onBlur } = this.props
        // let val = evt.currentTarget.value.trim()
        const { onBlur } = this.props;
        this.setState({ value: emojiReplace(evt.currentTarget.value.trim()) });
        onBlur?.(emojiReplace(evt.currentTarget.value.trim()), evt);
    };
    handleChange = evt => {
        const { onChange } = this.props;
        this.setState({ value: emojiReplace(evt.currentTarget.value) });
        onChange?.(emojiReplace(evt.currentTarget.value), evt);
    };
    handleSearch = (val, evt) => {
        const { onSearch } = this.props;
        this.setState({ value: emojiReplace(val.trim()) });
        onSearch?.(emojiReplace(val.trim()), evt);
    };
    render() {
        const { value } = this.state;
        return <Input.Search {...this.props} value={value} onChange={this.handleChange} onBlur={this.handleBlur} onSearch={this.handleSearch} />;
    }
}

class TextArea extends Component {
    handleBlur = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value.trim()), evt);
    };
    handleChange = evt => {
        this.props.onChange?.(emojiReplace(evt.currentTarget.value), evt);
    };
    render() {
        return <Input.TextArea {...this.props} onChange={this.handleChange} onBlur={this.handleBlur} />;
    }
}
TrimBlurInput.Search = Search;
TrimBlurInput.TextArea = TextArea;
TrimBlurInput.Password = Password;

export { Search, TextArea, Password };
export default TrimBlurInput;
