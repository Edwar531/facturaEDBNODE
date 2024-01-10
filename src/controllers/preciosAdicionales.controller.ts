import { Request, Response } from "express";
import { Cliente } from "../models/cliente.model";
import { getOrder, getPagination, getPagingData } from "../helpers/pagination";
import { PreciosAddProducto } from "../models/inventario/preciosAddProducto.model";
import { Op } from "sequelize";

export const getPreciosAds = async (req: Request, res: Response) => {
  const { uid: user_id } = req.body;
  let { page, pageSize, estado } = req.query;
  const { limit, offset } = getPagination(page, pageSize);
  let deshabilitado = 0;
  if (estado && estado != "Activos") {
    deshabilitado = 1;
  }
  const order: any = getOrder(req.query);

  await PreciosAddProducto.findAndCountAll({
    where: { user_id, deshabilitado },
    limit,
    offset,
    order: [order],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      return res.json(response);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

export const postPreciosAds = async (req: Request, res: Response) => {
  const { uid: user_id, id } = req.body;
  const body = req.body;
  const { descripcion, porcentaje_ganancia } = req.body;
  
  let errors: any = {};
  const descripcionExist = await PreciosAddProducto.findOne({
    where: {
      user_id,
      id: { [Op.ne]: id },
      descripcion,
    },
  });

  if (descripcionExist) {
    errors.descripcion =
      "Ya existe un precio con la descripción: " + descripcion;
  }

  const porcentaje_gananciaExist = await PreciosAddProducto.findOne({
    where: {
      user_id,
      id: { [Op.ne]: id },
      porcentaje_ganancia,
    },
  });

  if (porcentaje_gananciaExist) {
    errors.porcentaje_ganancia =
      "Ya existe un precio con el porcentaje: " + porcentaje_ganancia;
  }

  if (Object.keys(errors).length != 0) {
    return res.status(422).json({
      errors,
    });
  }

  //   $this->validate($request, [
  //     'descripcion' => 'required|' . Rule::unique('precios_add_productos')->where('user_id', $user_id)->ignore($request->id),
  //     'porcentaje_ganancia' => 'required|' . Rule::unique('precios_add_productos')->where('user_id', $user_id)->ignore($request->id),
  // ]);

  if (id) {
    try {
      await PreciosAddProducto.update(body, {
        where: {
          user_id,
          id,
        },
      });

      res.json({
        message: "Precio actualizado con éxito.",
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  } else {
    body.user_id = user_id;
    try {
      await PreciosAddProducto.create(body);
      res.json({
        message: "Cliente creado con éxito.",
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  }
};

export const habilitarPreciosAds = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  try {
    await PreciosAddProducto.update(
      { deshabilitado: 0 },
      {
        where: {
          user_id: uid,
          id,
        },
      }
    );

    res.json({ message: "El elemento ha sido habilitado." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const deshabilitarPreciosAds = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;

  try {
    await PreciosAddProducto.update(
      { deshabilitado: 1 },
      {
        where: {
          user_id: uid,
          id,
        },
      }
    );
    return res.json({ message: "Elementos habilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const habilitarLotePreciosAds = async (req: Request, res: Response) => {
  const { uid, selected } = req.body;

  try {
    await PreciosAddProducto.update(
      { deshabilitado: 0 },
      {
        where: {
          user_id: uid,
          id: selected,
        },
      }
    );
    return res.json({ message: "Elementos deshabilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const deshabilitarLotePreciosAds = async (
  req: Request,
  res: Response
) => {
  const { uid, selected } = req.body;

  try {
    await PreciosAddProducto.update(
      { deshabilitado: 1 },
      {
        where: {
          user_id: uid,
          id: selected,
        },
      }
    );
    return res.json({ message: "Elementos deshabilitados con éxito." });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
// deshabilitado;
