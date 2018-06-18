import React from 'react';
import Animate from 'rc-animate';
import Icon from 'antd/lib/icon';
import Tooltip from 'antd/lib/tooltip';
import Progress from 'antd/lib/progress';
import Checkbox from 'antd/lib/checkbox';
import classNames from 'classnames';
import { UploadListProps, UploadFile } from './interface';
import s from './UploadList.less'

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
const previewFile = (file: File, callback: Function) => {
  const reader = new FileReader();
  reader.onloadend = () => callback(reader.result);
  reader.readAsDataURL(file);
};

function get_url_extension( url: String ): String {
    return url.split(/\#|\?/)[0].split('.').pop().trim();
}

export default class UploadList extends React.Component<UploadListProps, any> {
  static defaultProps = {
    listType: 'text',  // or picture
    progressAttr: {
      strokeWidth: 2,
      showInfo: false,
    },
    prefixCls: 'ant-upload',
    showRemoveIcon: true,
    showPreviewIcon: true,
  };

  handleClose = (file: UploadFile) => {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(file);
    }
  }

  handlePreview = (file: UploadFile, e) => {
    const { onPreview } = this.props;
    if (!onPreview) {
      return;
    }
    e.preventDefault();
    return onPreview(file);
  }

  handleCheck = (file: UploadFile, e) => {
      const { onCheck } = this.props;
      if (!onCheck) {
          return;
      }
      e.preventDefault();
      return onCheck(file, e.target.checked);
  }

  componentDidUpdate() {
    if (this.props.listType !== 'picture' && this.props.listType !== 'picture-card') {
      return;
    }
    (this.props.items || []).forEach(file => {
      if (typeof document === 'undefined' ||
          typeof window === 'undefined' ||
          !(window as any).FileReader || !(window as any).File ||
          !(file.originFileObj instanceof File) ||
          file.thumbUrl !== undefined) {
        return;
      }
      /*eslint-disable */
      file.thumbUrl = '';
      /*eslint-enable */
      previewFile(file.originFileObj, (previewDataUrl) => {
        /*eslint-disable */
        file.thumbUrl = previewDataUrl;
        /*eslint-enable */
        this.forceUpdate();
      });
    });
  }

  render() {
    const { prefixCls, items = [], listType, showPreviewIcon, showRemoveIcon, locale } = this.props;
    const list = items.map(file => {
      let progress;
      let icon = <Icon type={file.status === 'uploading' ? 'loading' : 'paper-clip'} />;

      let ext = get_url_extension(file.url || '')
      ext = ext ? `.${ext}` : ext
      const isVideo = [ '.mp3', '.mp4', '.avi', '.mov' ].indexOf(ext) >= 0

      if (listType === 'picture' || listType === 'picture-card') {
        if (file.status === 'uploading' || (!file.thumbUrl && !file.url)) {
          if (listType === 'picture-card') {
            icon = <div className={`${prefixCls}-list-item-uploading-text`}>{locale.uploading}</div>;
          } else {
            icon = <Icon className={`${prefixCls}-list-item-thumbnail`} type="picture" />;
          }
        } else {
          icon = (
            <a
              className={`${prefixCls}-list-item-thumbnail`}
              onClick={e => this.handlePreview(file, e)}
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {
                isVideo ?
                    <video src={file.url} />
                    :
                    <img src={file.thumbUrl || file.url} alt={file.name} />
              }
            </a>
          );
        }
      }

      if (file.status === 'uploading') {
        // show loading icon if upload progress listener is disabled
        const loadingProgress = ('percent' in file) ? (
          <Progress type="line" {...this.props.progressAttr} percent={file.percent} />
        ) : null;

        progress = (
          <div className={`${prefixCls}-list-item-progress`} key="progress">
            {loadingProgress}
          </div>
        );
      }
      const infoUploadingClass = classNames({
        [`${prefixCls}-list-item`]: true,
        [`${prefixCls}-list-item-${file.status}`]: true,
          [s['list-item']]: true,
      });
      const preview = file.url ? (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${prefixCls}-list-item-name`}
          onClick={e => this.handlePreview(file, e)}
          title={file.name}
        >
          {file.name}
        </a>
      ) : (
        <span
          className={`${prefixCls}-list-item-name`}
          onClick={e => this.handlePreview(file, e)}
          title={file.name}
        >
          {file.name}
        </span>
      );
      const style = (file.url || file.thumbUrl) ? undefined : {
        pointerEvents: 'none',
        opacity: 0.5,
      };
      const previewIcon = showPreviewIcon ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          onClick={e => this.handlePreview(file, e)}
          title={locale.previewFile}
        >
          <Icon type="eye-o" />
        </a>
      ) : null;
      const removeIcon = showRemoveIcon ? (
        <Icon type="delete" title={locale.removeFile} onClick={() => this.handleClose(file)} />
      ) : null;
      const removeIconCross = showRemoveIcon ? (
        <Icon type="cross" title={locale.removeFile} onClick={() => this.handleClose(file)} />
      ) : null;
      const actions = (listType === 'picture-card' && file.status !== 'uploading')
        ? <span className={`${prefixCls}-list-item-actions`}>{previewIcon}{removeIcon}</span>
        : removeIconCross;
      let message;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = (file.error && file.error.statusText) || locale.uploadError;
      }
      const iconAndPreview = (file.status === 'error')
        ? <Tooltip title={message}>{icon}{preview}</Tooltip>
        : <span>{icon}{preview}</span>;

      let description = null
      if (!isVideo && file.width && file.height) {
        description = <div style={{ textAlign: 'center', lineHeight: '26px' }}>{ file.width } * { file.height }</div>
      } else if (isVideo) {
        description = <div style={{ textAlign: 'center', lineHeight: '26px' }}>视频素材</div>
      }

      const header = !isVideo && file.status !== 'uploading' ?
          <Checkbox checked={file.isIcon} onChange={(e) => this.handleCheck(file, e)} style={{ position: 'absolute', top: '-28px', left: 0, width: '100%' }}>作为Icon</Checkbox> : null

      return (
        <div className={infoUploadingClass} key={file.uid}>
          <div className={classNames(`${prefixCls}-list-item-info`, s['list-item-info'])}>
            {iconAndPreview}
          </div>
          {actions}
          {description}
          {header}
          <Animate transitionName="fade" component="">
            {progress}
          </Animate>
        </div>
      );
    });
    const listClassNames = classNames({
      [`${prefixCls}-list`]: true,
      [`${prefixCls}-list-${listType}`]: true,
        [s['custom']]: true,
        [s[listType]]: true,
    });
    const animationDirection =
      listType === 'picture-card' ? 'animate-inline' : 'animate';
    return (
      <Animate
        transitionName={`${prefixCls}-${animationDirection}`}
        component="div"
        className={listClassNames}
      >
        {list}
      </Animate>
    );
  }
}
