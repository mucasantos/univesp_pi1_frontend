import "./Supply.css";

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
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DataGrid } from "@mui/x-data-grid";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const Supply = () => {
  const [supplies, setSupplies] = useState([]);
  const [name, setName] = useState("");
  const [state, setState] = useState("DF");
  const [city, setCity] = useState("");
  const [productSupplies, setProductSupplies] = useState([]);

  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  useEffect(() => {
    api.get("/supplies").then((response) => {
      setSupplies(response.data);
    });

    api.get("/productsupplies").then((response) => {
      setProductSupplies(response.data);
    });
  }, []);

  const checkProductSupplies = (supplyId) => {
    const productSuppliesFiltered = productSupplies.filter(
      (productSupply) => productSupply.supply_id === supplyId
    );

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
          <DialogTitle>Editar Estoque</DialogTitle>
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
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              id="filled-select-currency"
              select
              label="Estado"
              value={state}
              onChange={(e) => setState(e.target.value)}
              variant="filled"
            >
              {states.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              inputProps={{ maxLength: 50, required: true }}
              autoFocus
              margin="dense"
              id="city"
              label="Cidade"
              type="text"
              fullWidth
              variant="standard"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUpdatePopUp(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                api
                  .put(`/supplies/${params.id}`, {
                    name,
                    state,
                    city,
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
            if (checkProductSupplies(params.id)) {
              alert(
                "Este estoque não pode ser excluído, pois existem produtos associados a ele."
              );
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
          <DialogTitle>Excluir estoque</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o estoque {params.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeletePopUp(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                api
                  .delete(`/supplies/${params.id}`)
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
      field: "name",
      headerName: "Nome",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "state",
      headerName: "Estado",
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
    setState("DF");
    setCity("");
  };

  return (
    <div className="Supplies">
      <Navbar />
      <div className="suppliesContainer">
        <div className="suppliesContainerTitle">
          <h1>Estoque</h1>
        </div>
        <div className="suppliesContainerContent">
          <div className="addSupplyArea">
            <Button variant="outlined" onClick={() => setShowAddPopUp(true)}>
              Adicionar estoque
            </Button>
          </div>
          <div className="suppliesList">
            <DataGrid
              rows={supplies}
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
            id="filled-select-currency"
            select
            label="Estado"
            value={state}
            onChange={(e) => setState(e.target.value)}
            variant="filled"
          >
            {states.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            inputProps={{ maxLength: 50, required: true }}
            autoFocus
            margin="dense"
            id="city"
            label="Cidade"
            type="text"
            fullWidth
            variant="standard"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddPopUp(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              api
                .post("/supplies", {
                  name,
                  state,
                  city,
                })
                .then((response) => {
                  setSupplies([...supplies, response.data]);
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

export default Supply;
