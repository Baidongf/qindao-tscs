import React from 'react'
import {Switch, withRouter, HashRouter} from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const CreateOrEdit = Loadable({
  loader: () => import('./children/CreateOrEdit'),
  loading: RouteLoading,
})

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading
})

const List = Loadable({
  loader: () => import('./children/List'),
  loading: RouteLoading
})

const AddCategory = Loadable({
  loader: () => import('./children/addCategory'),
  loading: RouteLoading
})

const CategoryMgt = Loadable({
  loader: () => import('./children/CategoryMgt'),
  loading: RouteLoading
})

class ProductBase extends React.Component {
  componentDidMount() {
  }

  render() {
    const {match} = this.props
    return (
      <div className='orgMgt-component'>

        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/categoryMgt`}
                        component={withRouter(CategoryMgt)}
                        permissionPath={[]}
                        noCheck={true}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/addCategory`} component={withRouter(AddCategory)}
                        permissionPath={[]}
                        noCheck={true}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}
                        permissionPath={['product/save']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/detail`} component={withRouter(Detail)}
                        permissionPath={['product/details']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/home`} component={withRouter(List)}
                        permissionPath={['product/query']}
            ></AuthRouter>
          </Switch>
        </HashRouter>

      </div>
    )
  }
}

export default ProductBase
