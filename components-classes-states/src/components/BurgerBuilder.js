import React, { useState, useEffect } from 'react';

// Ingredient prices
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
    tomato: 0.3
};

// Base burger price
const BASE_PRICE = 4.0;

// Ingredient selection component
const IngredientSelector = ({ onAdd, onRemove, ingredients }) => {
    return (
        <div className="ingredient-controls">
            <h3>Add Ingredients</h3>
            {Object.keys(INGREDIENT_PRICES).map(ingredient => (
                <div key={ingredient} className="ingredient-row">
                    <span className="ingredient-name">
                        {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                    </span>
                    <span className="ingredient-price">
                        ${INGREDIENT_PRICES[ingredient].toFixed(2)}
                    </span>
                    <div className="ingredient-buttons">
                        <button 
                            onClick={() => onRemove(ingredient)}
                            disabled={!ingredients[ingredient]}
                        >
                            -
                        </button>
                        <span className="ingredient-count">
                            {ingredients[ingredient] || 0}
                        </span>
                        <button 
                            onClick={() => onAdd(ingredient)}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Visual representation of the burger
const BurgerPreview = ({ ingredients }) => {
    // Convert ingredients object to array of layers
    const burgerLayers = Object.entries(ingredients).reduce((acc, [ingredient, count]) => {
        return [...acc, ...Array(count).fill(ingredient)];
    }, []);

    return (
        <div className="burger-preview">
            <div className="burger-bun-top">🍞</div>
            {burgerLayers.length === 0 ? (
                <p className="no-ingredients">Please start adding ingredients!</p>
            ) : (
                burgerLayers.map((layer, index) => (
                    <div 
                        key={index} 
                        className={`burger-layer ${layer}`}
                    >
                        {getIngredientEmoji(layer)}
                    </div>
                ))
            )}
            <div className="burger-bun-bottom">🍞</div>
        </div>
    );
};

// Helper function to get emoji for ingredients
const getIngredientEmoji = (ingredient) => {
    const emojis = {
        salad: '🥬',
        cheese: '🧀',
        meat: '🥩',
        bacon: '🥓',
        tomato: '🍅'
    };
    return emojis[ingredient] || '❓';
};

// Order summary component
const OrderSummary = ({ ingredients, totalPrice, onCheckout, onCancel }) => {
    return (
        <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="ingredients-summary">
                {Object.entries(ingredients).map(([ingredient, count]) => (
                    count > 0 && (
                        <div key={ingredient} className="summary-row">
                            <span>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</span>
                            <span>x {count}</span>
                            <span>${(INGREDIENT_PRICES[ingredient] * count).toFixed(2)}</span>
                        </div>
                    )
                ))}
            </div>
            <div className="price-summary">
                <div className="base-price">
                    <span>Base Price:</span>
                    <span>${BASE_PRICE.toFixed(2)}</span>
                </div>
                <div className="total-price">
                    <span>Total Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div className="order-actions">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onCheckout} className="checkout-button">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

// Shopping cart component
const Cart = ({ items, totalPrice }) => {
    return (
        <div className="cart">
            <h3>Shopping Cart</h3>
            {items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {items.map((item, index) => (
                        <div key={index} className="cart-item">
                            <span>Custom Burger #{index + 1}</span>
                            <span>${item.price.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main burger builder component
const BurgerBuilder = () => {
    // State management
    const [ingredients, setIngredients] = useState({
        salad: 0,
        cheese: 0,
        meat: 0,
        bacon: 0,
        tomato: 0
    });
    const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
    const [cart, setCart] = useState([]);
    const [isOrdering, setIsOrdering] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    // Update total price when ingredients change
    useEffect(() => {
        const ingredientCost = Object.entries(ingredients).reduce(
            (total, [ingredient, count]) => total + (INGREDIENT_PRICES[ingredient] * count),
            BASE_PRICE
        );
        setTotalPrice(ingredientCost);
    }, [ingredients]);

    // Add ingredient handler
    const handleAddIngredient = (type) => {
        setIngredients(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + 1
        }));
    };

    // Remove ingredient handler
    const handleRemoveIngredient = (type) => {
        if (ingredients[type] <= 0) return;
        setIngredients(prev => ({
            ...prev,
            [type]: prev[type] - 1
        }));
    };

    // Checkout handler
    const handleCheckout = () => {
        setCart(prev => [...prev, {
            ingredients: { ...ingredients },
            price: totalPrice
        }]);
        setCartTotal(prev => prev + totalPrice);
        
        // Reset burger builder
        setIngredients({
            salad: 0,
            cheese: 0,
            meat: 0,
            bacon: 0,
            tomato: 0
        });
        setIsOrdering(false);
    };

    return (
        <div className="burger-builder">
            <h2>Build Your Custom Burger</h2>
            
            <div className="builder-container">
                <div className="builder-left">
                    <BurgerPreview ingredients={ingredients} />
                    <button 
                        className="order-button"
                        onClick={() => setIsOrdering(true)}
                        disabled={Object.values(ingredients).every(count => count === 0)}
                    >
                        Order Now
                    </button>
                </div>

                <div className="builder-right">
                    <IngredientSelector 
                        onAdd={handleAddIngredient}
                        onRemove={handleRemoveIngredient}
                        ingredients={ingredients}
                    />
                </div>
            </div>

            {isOrdering && (
                <div className="order-modal">
                    <OrderSummary 
                        ingredients={ingredients}
                        totalPrice={totalPrice}
                        onCheckout={handleCheckout}
                        onCancel={() => setIsOrdering(false)}
                    />
                </div>
            )}

            <Cart items={cart} totalPrice={cartTotal} />
        </div>
    );
};

export default BurgerBuilder;