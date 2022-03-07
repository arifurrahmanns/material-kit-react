// /* eslint-disable prettier/prettier */
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { Navigate } from 'react-router-dom'
import './style.css';
// ----------------------------------------------------------------------



export default function App() {

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />

      <Router />
    </ThemeConfig>
  );
}
