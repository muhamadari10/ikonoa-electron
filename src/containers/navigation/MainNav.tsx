import React, { useEffect, useState } from 'react';
import { MdShoppingCart, MdLocalShipping } from 'react-icons/md';
import { SidebarItem, Sidebar } from 'react-rainbow-components';
import { useHistory } from "react-router-dom";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import styled from 'styled-components';
import { clearUserAndCabang } from '../../data/auth/AuthData';
import { KasirView } from '../kasir/KasirView';
import { ReturnView } from '../return/ReturnView';
import { syncronOfflineProduct, getNotaCabang, getRetur } from '../../data/product/ProductData';
import { GetReturResponResponse } from "../../data/product/ReturRespon";
import { pushDataServer, pushDataServerRetur } from '../../data/sales/SalesData';
import { GetProductInventoryResponse, } from '../../data/inventory/GetProductInventoryResponse';
import { GetNotaResponResponse } from "../../data/product/NotaRespon";
import './MainNav.css'

const StyledContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    width: 220px;
    background: ${props => props.background.main};
    border-bottom-left-radius: 0.875rem;
    border-right: 1px solid ${props => props.border.divider};
`;

export const SimpleVerticalNavigation: React.FC<any> = (props: any) => {

    const getDataOffline = () => {
        syncronOfflineProduct(
          '',
          (response: GetProductInventoryResponse) => {
            if (response.results.length > 0) {
              console.log("success syncronOfflineProduct", response);
            } else {
              // console.log("not found data ");
            }
          },
          (errorResp: Response) => {
            // console.log("error ");
          } 
        )
        
        getNotaCabang(
            (response: GetNotaResponResponse) => {
              if (response.results.length > 0) {
                console.log("success getNotaCabang", response);
              } else {
                // console.log("not found data ");
              }
            },
            (errorResp: Response) => {
              // console.log("error ");
            } 
        )

        getRetur(
            (response: GetReturResponResponse) => {
              console.log("success getRetur",response)
                if (response.results.length > 0) {
                  console.log("success getRetur", response);
                } else {
                  // console.log("not found data ");
                }
              },
              (errorResp: Response) => {
                // console.log("error ");
              } 
        )
    }

    const pushSalles = () => {
        pushDataServer()
        pushDataServerRetur()
    }

    const [selectedItem, setSelectedItem] = useState("penjualan")
    const history = useHistory();
    let { path, url } = useRouteMatch();

    function handleOnSelect(event: React.MouseEvent<HTMLElement, MouseEvent>, name: string) {
        return setSelectedItem(name)
    }

    return (
        <div >
            <div className="react-rainbow-admin-app_sidebar-container" >
                <Sidebar
                    selectedItem={selectedItem}
                    onSelect={handleOnSelect}
                    className="react-rainbow-admin-app_sidebar">

                    <SidebarItem
                        icon={<MdShoppingCart />}
                        className="react-rainbow-admin-app_sidebar-item"
                        name="penjualan"
                        label="Penjualan"
                        onClick={() => {
                            history.push(`${url}/penjualan`);
                        }} />

                    <SidebarItem
                        icon={<MdLocalShipping />}
                        className="react-rainbow-admin-app_sidebar-item"
                        name="returnbarang"
                        label="Retur"
                        onClick={() => {
                            history.push(`${url}/returnbarang`);
                        }} /> 

                    <SidebarItem
                        className="react-rainbow-admin-app_sidebar-item"
                        name="logout"
                        label="Logout"
                        onClick={() => {
                            clearUserAndCabang();
                            history.push(`/`);
                        }} />   
                </Sidebar>
                
                <div className="syncron btn">
                    <button className="btn" onClick={()=>{ getDataOffline() }}>Get Data</button>
                    <button className="btn" onClick={()=>{ pushSalles() }}>Transaction</button>
                </div>

            </div>

            <div className="react-rainbow-admin-app_router-container">
                <Switch>
                    <Route path={`${path}/returnbarang`}>
                        <ReturnView />
                    </Route>
                    <Route path={`${path}/penjualan`}>
                        <KasirView />
                    </Route>
                    <Route>
                        <Redirect to={`${path}/penjualan`} />
                    </Route>
                </Switch>
            </div>
            
            
        </div>
    );
}