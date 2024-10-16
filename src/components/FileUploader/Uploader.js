'use strict';
import React, { Component } from 'react';
import { message, Modal, Spin, Upload } from 'antd';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { injectIntl } from 'umi';
import controllable from '@/components/react-controllables';
import { joinPath } from '@/utils';

const FilePutUri = 'uploadFotaFile';

export const UploaderPropTypes = {
    allowFileExt: PropTypes.array,
    maxFileSize: PropTypes.number,
    maxFileCount: PropTypes.number,
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    headers: PropTypes.object,
    autoUpload: PropTypes.bool,
    wrappedComponentRef: PropTypes.func,
    showLoading: PropTypes.bool,
    onFileSelect: PropTypes.func,
    showUploadList: PropTypes.bool,
    fileList: PropTypes.array,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    onFileListChange: PropTypes.func,
    fixParams: PropTypes.object
};

@controllable(['value', 'fileList'])
class Uploader extends Component {
    static propTypes = UploaderPropTypes;
    static defaultProps = {
        name: 'file',
        onError: err => {
            message.error(err.message);
        },
        action: FilePutUri,
        autoUpload: true,
        showLoading: true,
        showUploadList: true,
        multiple: false,
        fileList: [],
        maxFileSize: 50 * 1024
    };
    state = {
        uploading: false
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && this.props.value !== nextProps.value) {
            this.syncValue2FileList(nextProps.value);
        }
    }
    componentDidMount() {
        this.syncValue2FileList(this.props.value);
        if (this.props.wrappedComponentRef) {
            this.props.wrappedComponentRef(this);
        }
    }
    syncValue2FileList = value => {
        let { fileList, onFileListChange } = this.props;
        if (!fileList) {
            fileList = [];
        }
        if (!value) {
            value = [];
        } else {
            if (!Array.isArray(value)) {
                value = [value];
            }
        }
        const newList = [];
        fileList.forEach(file => {
            if (value.some(item => item === file.value)) {
                newList.push(file);
            }
        });
        value.forEach(v => {
            if (!fileList.some(file => file.value === v)) {
                newList.push({
                    uid: v,
                    value: v,
                    url: v,
                    name: v,
                    status: 'success'
                });
            }
        });
        onFileListChange(newList);
    };
    beforeUpload = (file, fileList = []) => {
        const { onError, autoUpload } = this.props;
        file.error = this.check(file);
        if (file.error) {
            file.error.type = 'validate';
            onError && onError(file.error, file, fileList);
        }
        if (autoUpload) {
            setTimeout(() => {
                this.upload().catch(err => {
                    console.error(err);
                });
            });
        }
        return false;
    };
    handleChange = e => {
        let { event, file, fileList } = e;
        console.log(event, file, fileList, 'change');
        const { onFileSelect, maxFileCount, onFileListChange, multiple } = this.props;
        if (multiple) {
            if (maxFileCount > 0 && fileList.length > maxFileCount) {
                fileList.length = maxFileCount;
            }
        } else {
            fileList = fileList.slice(fileList.length - 1);
        }
        if (!event && (!file.status || file.status === 'uploading')) {
            onFileSelect && onFileSelect(file, fileList);
        }
        if (!fileList[fileList.length - 1].error) {
            onFileListChange(fileList);
        }
    };
    check = file => {
        const { allowFileExt, maxFileSize, intl } = this.props;
        if (!file) {
            return new Error(intl.formatMessage({ id: 'Component.Uploader.noFile' }));
        }

        if (allowFileExt) {
            const { name = '' } = file;
            const extName = name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
            const isAllowFile = allowFileExt.find(item => item.toLowerCase() === extName);
            if (!isAllowFile) {
                return new Error(
                    intl.formatMessage(
                        {
                            id: 'Validator.limitFileTypes'
                        },
                        { types: allowFileExt.join(',') }
                    )
                );
            }
        }
        if (maxFileSize && file.size / 1024 > maxFileSize) {
            let size = maxFileSize >= 1024 ? (maxFileSize / 1024).toFixed(2) + 'MB' : maxFileSize + 'KB';
            return new Error(intl.formatMessage({ id: 'Validator.fileSize' }, { size }));
        }
    };
    upload = () => {
        const { onChange, multiple, action, beforeUpload, afterUpload, responseInValue, fileList, onError, customRequest, fixParams = {}, intl } = this.props;
        const uploadList = [];
        (fileList || []).forEach((file, index) => {
            if (!file.status && file.originFileObj) {
                file.index = index;
                uploadList.push(file);
            }
        });
        if (uploadList.length <= 0) {
            return Promise.reject({ message: intl.formatMessage({ id: 'Component.Uploader.noFileUpload' }) });
        }
        this.setState({ uploading: true });
        const promises = [];
        uploadList.forEach(file => {
            const req = this.getRequest(file.originFileObj);
            if (customRequest) {
                customRequest(req);
                return;
            }
            const formData = new FormData();
            Object.keys(req.data).map(key => {
                formData.append(key, req.data[key]);
            });
            formData.append(req.filename, req.file);
            const upload = () => {
                const promise = request
                    .post(action, formData, {
                        headers: req.headers || {},
                        onUploadProgress: progressEvent => {
                            file.percent = progressEvent.percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            req.onProgress(progressEvent);
                        },
                        params: fixParams,
                        timeout: 0
                    })
                    .then(
                        response => {
                            req.onSuccess(response, file);
                            const returnValue = responseInValue ? response : response.data;
                            file.url = response.fileUrl;
                            file.value = returnValue;
                            if (multiple) {
                                const val = this.props.value || [];
                                val[file.index] = returnValue;
                                onChange(val, fileList);
                            } else {
                                onChange(returnValue, fileList);
                            }

                            afterUpload && afterUpload(file.originFileObj, formData, response);
                            return response;
                        },
                        error => {
                            file.status = 'error';
                            file.response = error.message;
                            req.onError(error, error && error.response);
                            onError && onError(error, file.originFileObj, fileList);
                            return Promise.reject(file);
                        }
                    );
                promises.push(promise);
            };
            if (beforeUpload) {
                const beforeRes = beforeUpload(file.originFileObj, fileList, formData);
                if (beforeRes === false) {
                    return;
                }
                if (beforeRes && beforeRes.then) {
                    beforeRes.then(rFile => {
                        if (rFile) {
                            file.originFileObj = rFile;
                        }
                        upload();
                    });
                } else {
                    upload();
                }
            } else {
                upload();
            }
        });
        return Promise.all(promises).finally(() => {
            this.setState({ uploading: false });
        });
    };
    getRequest = file => {
        const { name, action, headers, data, withCredentials, fileList, onFileListChange } = this.props;
        const params = { ...data };
        const uploadFile = fileList.find(item => item.uid === file.uid);
        return {
            filename: name,
            file,
            action: request.getAbsUrl(action),
            headers,
            data: params,
            withCredentials,
            onSuccess: (response, file) => {
                file.status = 'success';
                onFileListChange([...fileList]);
            },
            onError: (error, res) => {
                file.status = 'error';
                uploadFile.status = 'error';
                onFileListChange([...fileList]);
            },
            onProgress: event => {
                uploadFile.status = 'uploading';
                onFileListChange([...fileList]);
            }
        };
    };
    handleRemove = file => {
        const { fileList, onFileListChange, multiple, onChange, onRemove, intl } = this.props;
        Modal.confirm({
            title: intl.formatMessage({ id: 'Common.upload.deleteFile' }),
            content: intl.formatMessage({ id: 'Common.upload.confrimDeleteFile' }),
            cancelText: intl.formatMessage({ id: 'Common.button.cancel' }),
            okText: intl.formatMessage({ id: 'Common.button.ok' }),
            onOk: () => {
                const index = fileList.findIndex(item => item.uid === file.uid);
                if (multiple) {
                    fileList.splice(index, 1);
                    onFileListChange([...fileList]);
                    const value = this.props.value || [];
                    value.splice(index, 1);
                    onChange(value, fileList);
                } else {
                    onChange(undefined, fileList);
                    onFileListChange([]);
                }
                onRemove && onRemove(file, fileList);
            }
        });
        return false;
    };
    clear() {
        this.props.onChange(undefined, []);
        this.props.onFileListChange([]);
    }
    render() {
        const { children, onChange, showLoading, onFileListChange, ...restProps } = this.props;
        const { uploading } = this.state;
        const renderChildren = () => {
            if (showLoading && uploading) {
                return <Spin>{children}</Spin>;
            }
            return children;
        };
        return (
            <Upload {...restProps} onChange={this.handleChange} onRemove={this.handleRemove} beforeUpload={this.beforeUpload}>
                {renderChildren()}
            </Upload>
        );
    }
}

Uploader.FilePutUri = FilePutUri;

export default injectIntl(Uploader, { forwardRef: true });
