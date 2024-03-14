import "./Products.css";

import { useEffect, useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataGrid } from "@mui/x-data-grid";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [measure, setMeasure] = useState("");
  const [productSupplies, setProductSupplies] = useState([]);
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  useEffect(() => {
    api.get("/products").then((response) => {
      setProducts(response.data);
    });

    api.get("/productsupplies").then((response) => {
      setProductSupplies(response.data);
    });
  }, []);

  const checkProductSupplies = (productId) => {
    const productSuppliesFiltered = productSupplies.filter(
      (productSupply) => productSupply.product_id === productId
    );

    console.log(productSuppliesFiltered.length > 0);
    return productSuppliesFiltered.length > 0;
  };

  const UpdateButton = (params) => {
    return (
      <>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setShowUpdatePopUp(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <Dialog
          open={showUpdatePopUp}
          onClose={() => setShowUpdatePopUp(false)}
        >
          <DialogTitle>Editar produto</DialogTitle>
          <DialogContent>
            <div>{`Id: ${params.id}`}</div>
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="name"
              label="Nome"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="category"
              label="Categoria"
              type="text"
              fullWidth
              variant="standard"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              label="Preço"
              id="price"
              variant="standard"
              value={price}
              onChange={(e) => setPrice(stringToMoney(e.target.value))}
            />
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="measure"
              label="Unidade de medida"
              type="text"
              fullWidth
              variant="standard"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUpdatePopUp(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                api
                  .put(`/products/${params.id}`, {
                    name,
                    category,
                    price,
                    measure,
                  })
                  .then((response) => {
                    setProducts(
                      products.map((product) => {
                        if (product.id === params.id) {
                          return response.data;
                        }
                        return product;
                      })
                    );
                    setShowUpdatePopUp(false);
                    resetState();
                  })
                  .catch((error) => {
                    console.log(error);
                    alert("Erro ao adicionar produto");
                    setShowAddPopUp(false);
                  });
              }}
            >
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const DeleteButton = (params) => {
    return (
      <>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            if (checkProductSupplies(params.id)) {
              alert("Não é possível excluir produto em estoque");
              return;
            }
            setShowDeletePopUp(true);
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
        <Dialog
          open={showDeletePopUp}
          onClose={() => setShowDeletePopUp(false)}
        >
          <DialogTitle>Excluir produto</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o produto {params.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeletePopUp(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                api
                  .delete(`/products/${params.id}`)
                  .then((response) => {
                    setProducts(
                      products.filter((product) => product.id !== params.id)
                    );
                    setShowDeletePopUp(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    alert("Erro ao excluir produto");
                    setShowDeletePopUp(false);
                  });
              }}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Categoria",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Preço",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "measure",
      headerName: "Unidade medida",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "update",
      headerName: "Editar",
      sortable: false,
      renderCell: (params) => UpdateButton(params),
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "delete",
      headerName: "Deletar",
      sortable: false,
      renderCell: (params) => DeleteButton(params),
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const resetState = () => {
    setName("");
    setPrice("");
    setCategory("");
    setMeasure("");
  };

  const stringToMoney = (value) => {
    return value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="Products">
      <Navbar />
      <div className="productsContainer">
        <div className="productsContainerTitle">
          <h1>Produtos</h1>
        </div>
        <div className="productsContainerContent">
          <div className="addProductArea">
            <Button variant="outlined" onClick={() => setShowAddPopUp(true)}>
              Adicionar produto
            </Button>
          </div>
          <div className="productsList">
            <DataGrid
              rows={products}
              columns={columns}
              HorizontalAlignment="Stretch"
              HorizontalContentAlignment="Stretch"
              ColumnWidth="*"
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
      </div>
      <Dialog open={showAddPopUp} onClose={() => setShowAddPopUp(false)}>
        <DialogTitle>Adicionar produto</DialogTitle>
        <DialogContent>
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="name"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="category"
            label="Categoria"
            type="text"
            fullWidth
            variant="standard"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            label="Preço"
            name="numberformat"
            id="price"
            variant="standard"
            value={stringToMoney(price)}
            onChange={(e) => setPrice(stringToMoney(e.target.value))}
          />
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="measure"
            label="Unidade de medida"
            type="text"
            fullWidth
            variant="standard"
            value={measure}
            onChange={(e) => setMeasure(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddPopUp(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              api
                .post("/products", {
                  name,
                  category,
                  price,
                  measure,
                })
                .then((response) => {
                  setProducts([...products, response.data]);
                  setShowAddPopUp(false);
                  resetState();
                })
                .catch((error) => {
                  console.log(error);
                  alert("Erro ao adicionar produto");
                  setShowAddPopUp(false);
                });
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
