import React from "react"
import { Routes, Route } from "react-router-dom"
import Item from "./pages/Item"
import Catalogue from "./pages/Catalogue"
import Admin from "./pages/Admin"
import Main from "./pages/Main"
import News from "./pages/News"

const AppRoutes = ({type}) => {
    return (
        <Routes>
            <Route path="/" element = { <Main /> } />
            <Route path="/catalogue/:category?/:brandlink?/:search?/:sale?/:new?" element = { <Catalogue /> } />
            <Route path="/item/:id" element = { <Item /> } />
            <Route path="/admin" element = { <Admin /> } />
            <Route path="/news" element = { <News /> } />
        </Routes>
    )
}

export default AppRoutes;