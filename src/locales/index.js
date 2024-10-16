import en from './en-US';
import zh from './zh-CN';
// import { createIntl, createIntlCache } from 'react-intl';
import { getIntl, getLocale } from 'umi';
const messages = {
    'zh-CN': zh,
    'en-US': en
};

const _currentLang = getLocale?.() || localStorage.getItem('umi_locale') || 'zh-CN';
export const getCurrentLang = () => _currentLang;
export const getCurrentMessages = () => messages[_currentLang];
export const isCn = _currentLang === 'zh-CN';
// const cache = createIntlCache();
// const intl = createIntl(
//     {
//         locale: _currentLang,
//         messages: getCurrentMessages()
//     },
//     cache
// );
const intl = getIntl(getLocale());

export default intl;
