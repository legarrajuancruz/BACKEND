import ticketModel from "../models/ticket.model.js";

export default class TicketService {
  getAll = async () => {
    try {
      let tickets = await ticketModel.find();
      if (tickets.length > 0) {
        return tickets;
      } else {
        throw Error("Tickets not found.");
      }
    } catch (error) {
      throw {
        code: 404,
        message: "Error getting tickets.",
        detail: error.message,
      };
    }
  };

  getTicketById = async (id) => {
    try {
      let ticket = await ticketModel.findById(id);
      if (ticket) {
        return ticket;
      } else {
        throw Error("Ticket not found");
      }
    } catch (error) {
      throw {
        code: 404,
        message: `Error getting ticket with ID: ${id}.`,
        detail: error.message,
      };
    }
  };
  createTicket = async (ticket) => {
    console.log("CREATE TICKET");
    console.log(ticket);

    let resultTicket = await ticketModel.create(ticket);
    return resultTicket;
  };

  deleteTicket = async (id) => {
    try {
      if (id) {
        let result = await ticketModel.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
          return true;
        } else {
          let cart = await this.getTicketById(id);
          if (cart) {
            throw Error("No se pudo borrar el carrito.");
          } else {
            throw {
              code: 404,
              detail: "No se encontró el carrito!",
            };
          }
        }
      } else {
        throw {
          code: 400,
          detail: "Valor id vacío",
        };
      }
    } catch (error) {
      throw {
        code: error.code,
        message: error.message ? error.message : "Error eliminando carrito",
        detail: error.detail ? error.detail : error.message,
      };
    }
  };
}
