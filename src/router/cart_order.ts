import { Request, Response, Router } from "express";
// import { Cart } from "../models/order";
// import { IDmiddleware } from "../middleware/IDmiddlesware";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { Order } from "../models/orderProduct";
import { Product } from "../models/products";
const router = Router();

router.get(
    "/order",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { product } = request.query;
            if (!product) {
                const cart = await Order.findAll();
                return response.status(200).json(cart);
            } else {
                const cart = await Order.findAll({
                    where: { productID: product },
                });
                if (cart.length === 0)
                    return response.json({
                        msg: "there is no order on this product!",
                    });
                return response.status(200).json(cart);
            }
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/myCart",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = (request as any).user;
            const cart = await Order.findAll({ where: { userID: id } });
            const totalprice = await Order.sum("totalPrice", {
                where: { userID: id },
            });
            return response
                .status(200)
                .json({ cart: cart, totalprice: totalprice });
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post(
    "/order",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = (request as any).user;
            const { product, quantity } = request.body;
            const order = await Order.findOne({
                where: { userID: id, productID: product },
            });
            const products = await Product.findByPk(product);
            if (!products)
                return response.json({ msg: "there no such product" });
            if (order) {
                if (products!.inventory < quantity)
                    return response.json({
                        msg: `product ${products!.name} is out of stock!`,
                    });
                else {
                    const newINV = products!.inventory - quantity;
                    await Product.update(
                        { inventory: newINV },
                        { where: { id: product } }
                    );
                    const newQuantity = order.quantity + quantity;
                    const newPrice = products.price * newQuantity;
                    const newOrder = await Order.update(
                        { quantity: newQuantity, totalPrice: newPrice },
                        { where: { userID: id }, returning: true }
                    );
                    return response.status(200).json(newOrder);
                }
            }

            if (!order) {
                if (products!.inventory < quantity)
                    return response.json({
                        msg: `product ${products!.name} is out of stock!`,
                    });
                else {
                    const totalprice = quantity * products!.price;
                    const newOrder = Order.create(
                        {
                            userID: id,
                            productID: product,
                            quantity: quantity,
                            totalPrice: totalprice,
                        },
                        { returning: true }
                    );
                    const remaining = products.inventory - quantity;
                    await Product.update(
                        { inventory: remaining },
                        { where: { id: product } }
                    );
                    return response.status(200).json(newOrder);
                }
            }
        } catch (error) {
            return response.json(error);
        }
    }
);

router.patch(
    "/order",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = (request as any).user;
            const { quantity, product } = request.body;
            const products = await Product.findByPk(product);
            const price = products!.price * quantity;
            const Ordered = await Order.findOne({
                where: { productID: product },
            });
            if (Ordered!.quantity > quantity) {
                const newquan =
                    products!.inventory + (Ordered!.quantity - quantity);
                await Product.update(
                    { inventory: newquan },
                    { where: { id: product } }
                );
            }
            if (Ordered!.quantity < quantity) {
                const newquan =
                    products!.inventory - (quantity - Ordered!.quantity);
                await Product.update(
                    { inventory: newquan },
                    { where: { id: product } }
                );
            }
            const order = await Order.update(
                { quantity: quantity, totalPrice: price },
                { where: { userID: id, productID: product }, returning: true }
            );
            return response.status(200).json(order);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.delete(
    "/order",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = (request as any).user;
            const orders = await Order.findAll({ where: { userID: id } });
            if (orders.length === 0)
                return response.json({ msg: "there is no order to delete" });
            for (const order of orders) {
                const product = await Product.findByPk(order.productID);
                if (product) {
                    const newInventory = product.inventory + order.quantity;
                    await Product.update(
                        { inventory: newInventory },
                        { where: { id: order.productID } }
                    );
                }
            }
            await Order.destroy({ where: { userID: id } });
            return response
                .status(200)
                .json({ msg: "cart deleted successfully!" });
        } catch (error) {
            return response.json(error);
        }
    }
);

// router.patch(
//     "/cart/:id",
//     async (request: Request, response: Response): Promise<any> => {
//         try {
//             const { status } = request.body;
//             const { id } = request.params;
//             const order = await Order.findAll({ where: { cartID: id } });
//             if (order.length === 0) {
//                 return response
//                     .status(200)
//                     .json({ msg: "there is no product to add to cart" });
//             }
//             if (order.length !== 0) {
//                 let totalamount = 0;
//                 for (const O of order) {
//                     totalamount += (O as any).totalPrice;
//                 }

//                 const cart = await Cart.update(
//                     { totalprice: totalamount, status: status },
//                     { where: { id: id } }
//                 );
//                 return response.status(200).json(cart);
//             }
//         } catch (error) {
//             return response.json(error);
//         }
//     }
// );

// router.delete(
//     "/cart/:id",
//     async (request: Request, response: Response): Promise<any> => {
//         try {
//             const { id } = (request as any).params;
//             await Cart.destroy({ where: { id: id } });
//             return response
//                 .status(200)
//                 .json({ msg: "cart deleted successfully!" });
//         } catch (error) {
//             return response.json(error);
//         }
//     }
// );

// //-----------------------------------------------------------------------

// router.get(
//     "/order/cart",
//     AuthMiddleware,
//     async (request: Request, response: Response): Promise<any> => {
//         try {
//             const { id } = (request as any).user;
//             const cart = await Cart.findAll({ where: { UserId: id } });
//             const orders = await Order.findAll({
//                 where: { cartID: cart[0].id },
//                 include: [
//                     { model: Cart },
//                     { model: Product, attributes: ["name", "price"] },
//                 ],
//             });
//             return response.status(200).json(orders);
//         } catch (error) {
//             return response.json(error);
//         }
//     }
// );

// router.patch(
//     "/order",
//     AuthMiddleware,
//     async (request: Request, response: Response): Promise<any> => {
//         try {
//             const { id } = (request as any).user;
//             const { quantity, product } = request.body;
//             const cart = await Cart.findOne({ where: { UserId: id } });

//             if (!cart)
//                 return response
//                     .status(404)
//                     .json({ msg: "you have not any order to update" });
//             const orders = await Order.findOne({
//                 where: { productID: product },
//             });

//             if (!orders)
//                 return response
//                     .status(200)
//                     .json({ msg: "there is no product to edit!" });
//             if (orders) {
//                 const products = await Product.findOne({
//                     where: { id: product },
//                 });
//                 const price = products?.price! * quantity;
//                 await Order.update(
//                     { quantity: quantity, totalPrice: price },
//                     {
//                         where: { cartID: cart.id, productID: product },
//                         returning: true,
//                     }
//                 );
//                 const order = await Order.findAll({
//                     where: { cartID: cart.id, productID: product },
//                 });
//                 return response.status(200).json(order);
//             }
//         } catch (error) {
//             return response.json(error);
//         }
//     }
// );

// router.delete(
//     "/order",
//     AuthMiddleware,
//     async (request: Request, response: Response): Promise<any> => {
//         try {
//             const { id } = (request as any).user;
//             const { product } = request.body;
//             const cart = await Cart.findAll({ where: { UserId: id } });
//             if (cart.length === 0)
//                 return response
//                     .status(404)
//                     .json({ msg: "you have not any order to delete" });
//             else {
//             }
//             const order = await Order.destroy({
//                 where: { cartID: cart[0].id, productID: product },
//             });
//             return response.status(200).json(order);
//         } catch (error) {
//             return response.json(error);
//         }
//     }
// );

export default router;
