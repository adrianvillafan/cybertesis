import React from 'react'
import ReactDOM from 'react-dom/client'
import "@cloudscape-design/global-styles/index.css"
import { I18nProvider, importMessages } from "@cloudscape-design/components/i18n";
import esMessages from '@cloudscape-design/components/i18n/messages/all.es';
import App from './App.jsx'

const locale = document.documentElement.lang;
const messages = await importMessages(locale);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider locale={locale} messages={messages}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
)
