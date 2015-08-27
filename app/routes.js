import Admin from './components/Admin'
import AdminColorPalettes from './components/Admin/AdminColorPalettes'
import AdminCreateDesign from './components/Admin/AdminCreateDesign'
import AdminCreateLayerImage from './components/Admin/AdminCreateLayerImage'
import AdminDesigns from './components/Admin/AdminDesigns'
import AdminEditDesign from './components/Admin/AdminEditDesign'
import AdminLayerImages from './components/Admin/AdminLayerImages'
import AdminSurfaces from './components/Admin/AdminSurfaces'
import AdminTags from './components/Admin/AdminTags'
import AdminUsers from './components/Admin/AdminUsers'
import App from './components/App'
import Cart from './components/Cart'
import Designs from './components/Designs'
import DesignDetail from './components/Design/DesignDetail'
import DesignEdit from './components/Design/DesignEdit'
import DesignEditDetail from './components/Design/DesignEditDetail'
import DesignEditSurface from './components/Design/DesignEditSurface'
import {Route, NotFoundRoute, DefaultRoute} from 'react-router'
import React from 'react'

export default (
  <Route ignoreScrollBehavior={true} handler={App}>
    <NotFoundRoute handler={Designs}/>
    <DefaultRoute handler={Designs}/>

    <Route name="designs" handler={Designs} path="designs/?">
      <Route name="designDetail" handler={DesignDetail} path=":designId/?"/>
    </Route>

    <Route name="cart" handler={Cart} path="/designs/:designId/cart/?"/>
    <Route name="designEditSurface" handler={DesignEditSurface} path="/designs/:designId/edit/surface/?"/>
    <Route name="designEdit" handler={DesignEdit} path="/designs/:designId/edit/:layerId/?"/>
    <Route name="designEditDetail" handler={DesignEditDetail} path="/designs/:designId/edit/:layerId/:imagesOrColors/?"/>

    <Route name="admin" handler={Admin} path="admin/?">
      <Route name="adminColorPalettes" handler={AdminColorPalettes} path="colorPalettes/?"/>
      <Route name="adminCreateDesign" handler={AdminCreateDesign} path="createDesign/?"/>
      <Route name="adminCreateLayerImage" handler={AdminCreateLayerImage} path="uploadLayerImage/?"/>
      <Route name="adminDesigns" handler={AdminDesigns} path="designs/?"/>
      <Route name="adminEditDesign" handler={AdminEditDesign} path="designs/:designId/edit/?"/>
      <Route name="adminLayerImages" handler={AdminLayerImages} path="layerImages/?"/>
      <Route name="adminSurfaces" handler={AdminSurfaces} path="surfaces/?"/>
      <Route name="adminTags" handler={AdminTags} path="tags/?"/>
      <Route name="adminUsers" handler={AdminUsers} path="users/?"/>
    </Route>

  </Route>
)
