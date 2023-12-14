import '../styles/globals.css'
import styles from '../styles/app.module.css'
import { store } from '../store/store'
import { Provider } from 'react-redux'

import Header from './components/layout/header.js'
import Content from './components/content/content'
import Footer from './components/layout/footer.js'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {



  return (
    <Provider store={store}>
      <div className={styles.container}>
        <Header />
        <Content/>
        <Footer/>
        <div className={styles.header}>
        </div>
        
      </div>
    </Provider>
  )
}
