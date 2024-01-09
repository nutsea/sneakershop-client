import React from "react";
import { Routes, Route } from "react-router-dom";
import Item from "./pages/Item";
import Catalogue from "./pages/Catalogue";
import Admin from "./pages/Admin";

const AppRoutes = ({type}) => {
    return (
        <Routes>
            <Route path="/" element = { <Catalogue /> } />
            <Route path="/item/:id/:code" element = { <Item /> } />
            <Route path="/admin" element = { <Admin /> } />
        </Routes>
    );
}

export default AppRoutes;