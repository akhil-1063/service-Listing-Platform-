import {Router} from "express";
import { createServiceProvider, getAllServiceProviders, getServiceProviderById,updateServiceProviderById,deleteServiceProviderById } from "../controllers/ServiceProvider.controller.js";

const router = Router();


//routes for getting and creating service providers
router.route("/").get(getAllServiceProviders).post(createServiceProvider);

//routes for getting, updating, and deleting a single service provider by ID
router.route("/:id").get(getServiceProviderById).put(updateServiceProviderById).delete(deleteServiceProviderById);

export default router;