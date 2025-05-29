import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import Header from '../Header/Header';
import Menu from './Menu/Menu';
import ShoppingList from './ShoppingList/ShoppingList';
import { observer } from 'mobx-react-lite';
import { generatePdfForMenuAndShoppingList } from '../utils/pdfUtils';
import { toJS } from 'mobx';
import './MenuPage.css';

function MenuPage() {
    const { menuStore, store } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const userId = store.user.id;

    useEffect(() => {
        menuStore.fetchMenu(userId);
        menuStore.fetchAggregatedIngredients(userId);
        console.log(menuStore.menu);
        console.log(menuStore.aggregatedIngredients);
    }, [userId]);

    const handlePdfExport = () => {
        const menu = [...menuStore.menu];
        const aggregatedIngredients = [...menuStore.aggregatedIngredients];
        const normalMenu = toJS(menu);
        const normalAggregatedIngredients = toJS(aggregatedIngredients);
        if (!menu.length || !aggregatedIngredients.length) {
            console.error('Menu or ingredients not loaded yet');
            return;
        }

        setIsLoading(true);
        console.log('MENU:', toJS(menuStore.menu));

        generatePdfForMenuAndShoppingList({
            menu: normalMenu,
            aggregatedIngredients: normalAggregatedIngredients,
        });
        setIsLoading(false);
    };

    return (
        <div className="menu-page">
            <Header />
            <Menu />
            <ShoppingList />

            <button className="button-menu" onClick={handlePdfExport} disabled={isLoading}>
                {isLoading ? 'Завантаження...' : 'Зберегти меню та список продуктів як PDF'}
            </button>
        </div>
    );
}

export default observer(MenuPage);
