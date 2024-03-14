import "./List.css";

import { useEffect, useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataGrid } from "@mui/x-data-grid";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

const List = () => {
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [productSupplies, setProductSupplies] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("None");
  const [selectedSupply, setSelectedSupply] = useState("None");
  const [amount, setAmount] = useState("");
  const [measure, setMeasure] = useState("");
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  useEffect(() => {
    api.get("/products").then((response) => {
      setProducts(response.data);
    });

    api.get("/supplies").then((response) => {
      setSupplies(response.data);
    });

    api.get("/productsupplies").then((response) => {
      setProductSupplies(response.data);
    });
  }, []);

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
          <DialogTitle>Editar produto no estoque</DialogTitle>
          <DialogContent>
            <div>{`Id: ${params.id}`}</div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="filled-select-currency"
                select
                label="Estoque"
                defaultValue="Nenhum"
                value={selectedSupply}
                onChange={(e) => setSelectedSupply(e.target.value)}
                variant="filled"
              >
                {supplies.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <br />
              <TextField
                id="filled-select-currency"
                defaultValue="Nenhum"
                select
                label="Produto"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                variant="filled"
              >
                {products.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="amount"
              label="Quantidade"
              type="number"
              fullWidth
              variant="standard"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="measure"
              label="Unidade de medida"
              type="Text"
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
                  .put(`/productsupplies/${params.id}`, {
                    selectedProduct,
                    selectedSupply,
                    amount,
                    measure,
                  })
                  .then((response) => {
                    setSupplies(
                      supplies.map((supply) => {
                        if (supply.id === params.id) {
                          return response.data;
                        }
                        return supply;
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
            setShowDeletePopUp(true);
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
        <Dialog
          open={showDeletePopUp}
          onClose={() => setShowDeletePopUp(false)}
        >
          <DialogTitle>Excluir estoque</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o produto no estoque ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeletePopUp(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                api
                  .delete(`/productsupplies/${params.id}`)
                  .then((response) => {
                    setSupplies(
                      supplies.filter((supply) => supply.id !== params.id)
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
      field: "supply_id",
      headerName: "ID do estoque",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "product_id",
      headerName: "ID do produto",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount",
      headerName: "Qtd no estoque",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "product_supply_measure",
      headerName: "Un. no estoque",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "supply_name",
      headerName: "Estoque",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "state",
      headerName: "UF",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "city",
      headerName: "Cidade",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "product_name",
      headerName: "Produto",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "product_category",
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
      field: "product_measure",
      headerName: "Un. do produto",
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
    setSelectedProduct(null);
    setSelectedSupply(null);
    setAmount("");
    setMeasure("");
  };

  return (
    <div className="List">
      <Navbar />
      <div className="productSupplyContainer">
        <div className="listContainerTitle">
          <h1>Estoque</h1>
        </div>
        <div className="listContainerContent">
          <div className="addProductSupplyArea">
            <Button variant="outlined" onClick={() => setShowAddPopUp(true)}>
              Adicionar produto a um estoque
            </Button>
          </div>
          <div className="productSupplyList">
            <DataGrid
              rows={productSupplies}
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
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="filled-select-currency"
              select
              label="Estoque"
              defaultValue="Nenhum"
              value={selectedSupply}
              onChange={(e) => setSelectedSupply(e.target.value)}
              variant="filled"
            >
              {supplies.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <br />
            <TextField
              id="filled-select-currency"
              defaultValue="Nenhum"
              select
              label="Produto"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              variant="filled"
            >
              {products.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="amount"
            label="Quantidade"
            type="number"
            fullWidth
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="measure"
            label="Unidade de medida"
            type="Text"
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
                .post("/productsupplies", {
                  selectedProduct,
                  selectedSupply,
                  amount,
                  measure,
                })
                .then((response) => {
                  setProductSupplies([...productSupplies, response.data]);
                  setShowAddPopUp(false);
                  resetState();
                })
                .catch((error) => {
                  console.log(error);
                  alert("Erro ao adicionar produto ao estoque");
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

export default List;
