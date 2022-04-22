import render from './render';
import router from "./router";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';


window.addEventListener('load',async ()=>{
  render.initAppEntry();

})

window.addEventListener('load', router);
window.addEventListener('hashchange', router);