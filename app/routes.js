import Admin from './components/Admin'
import AdminDesigns from './components/Admin/AdminDesigns'
import AdminLayerImages from './components/Admin/AdminLayerImages'
import AdminColorPalettes from './components/Admin/AdminColorPalettes'
import AdminUsers from './components/Admin/AdminUsers'
import AdminCreateDesign from './components/Admin/AdminCreateDesign'
import AdminEditDesign from './components/Admin/AdminEditDesign'
import AdminCreateLayerImage from './components/Admin/AdminCreateLayerImage'
import App from './components/App'
import Designs from './components/Designs'
import DesignDetail from './components/Design/DesignDetail'
import DesignEdit from './components/Design/DesignEdit'
import Cart from './components/Cart'
import React from 'react'
import Router from 'react-router'
var Route = Router.Route;

export default (
  <Route ignoreScrollBehavior={true} handler={App}>
    <Router.NotFoundRoute handler={Designs} />
    <Router.DefaultRoute handler={Designs}/>

    <Route name="designs" handler={Designs} path="designs/?">
      <Route name="designDetail" handler={DesignDetail} path=":designId/?"/>
    </Route>
    <Route name="cart" handler={Cart} path="/designs/:designId/cart/?"/>
    <Route name="designEdit" handler={DesignEdit} path="/designs/:designId/edit/:step/?"/>
    <Route name="layerEdit" handler={DesignEdit} path="/designs/:designId/edit/layers/:layerId/:imagesOrColors/?"/>

    <Route name="admin" handler={Admin} path="admin/?">
      <Route name="adminDesigns" handler={AdminDesigns} path="designs/?"/>
      <Route name="adminEditDesign" handler={AdminEditDesign} path="designs/:designId/edit/?"/>
      <Route name="adminLayerImages" handler={AdminLayerImages} path="layerImages/?"/>
      <Route name="adminColorPalettes" handler={AdminColorPalettes} path="colorPalettes/?"/>
      <Route name="adminUsers" handler={AdminUsers} path="users/?"/>
      <Route name="adminCreateDesign" handler={AdminCreateDesign} path="createDesign/?"/>
      <Route name="adminCreateLayerImage" handler={AdminCreateLayerImage} path="uploadLayerImage/?"/>
    </Route>

  </Route>
)
