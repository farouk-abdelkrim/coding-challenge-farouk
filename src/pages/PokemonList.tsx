import React, { useEffect, useState } from "react";
import {
  fetchPokemonDetails,
  fetchPokemons
} from "../services/pokemon.service";
import {
  Card,
  Row,
  Col,
  Typography,
  Pagination,
  PaginationProps,
  Skeleton,
  Descriptions,
  Drawer,
  Input,
  Image
} from "antd";
const { Search } = Input;

interface Item {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  name: string;
  height: number;
  base_experience: number;
  weight: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
}

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Item[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [text, setText] = useState<string>("");
  const [next, setNext] = useState<string>(
    "https://pokeapi.co/api/v2/pokemon/"
  );
  const [previous, setPrevious] = useState<string>("");

  useEffect(() => {
    getPokemons(next);
  }, []);

  const getPokemons = async (url: string) => {
    setIsLoading(true);
    const response = await fetchPokemons(url);
    setTotalRows(response.count);
    setPokemons(response.results);
    setNext(response.next);
    setPrevious(response.previous);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  const onChange: PaginationProps["onChange"] = (page) => {
    if (page > current) {
      getPokemons(next);
    } else {
      getPokemons(previous);
    }
    setCurrent(page);
  };
  const onSearch = (value: string) => {
    setText(value);
  };

  const getDetails = async (name: string) => {
    const response = await fetchPokemonDetails(name);
    setSelectedPokemon({
      id: response.id,
      name: response.name,
      height: response.height,
      base_experience: response.base_experience,
      weight: response.weight,
      size: response.size,
      smoothness: response.smoothness,
      soil_dryness: response.soil_dryness
    });
  };
  return (
    <>
      <Typography.Title>Pokemon list</Typography.Title>
      <div style={{ textAlign: "center" }}>
        <Search
          width={"150px"}
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
      </div>

      {pokemons.length == 0 ? (
        <Skeleton loading={isLoading} />
      ) : (
        <>
          <Row gutter={16} style={{ marginTop: "2vh" }}>
            {text != ""
              ? pokemons
                  .filter((el) => el.name.indexOf(text) != -1)
                  .map((p) => (
                    <Col span={5} className="card">
                      <Card
                        onClick={() => getDetails(p.name)}
                        title={p.name}
                        bordered={false}
                      ></Card>
                    </Col>
                  ))
              : pokemons.map((p) => (
                  <Col span={5} className="card">
                    <Card
                      onClick={() => getDetails(p.name)}
                      title={p.name}
                      bordered={false}
                    ></Card>
                  </Col>
                ))}
          </Row>
          <Pagination
            simple
            current={current}
            onChange={onChange}
            total={totalRows}
          />

          <Drawer
            onClose={() => setSelectedPokemon(null)}
            width={"60%"}
            visible={null != selectedPokemon}
          >
            <Row justify="center">
              <Image
                src={
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                  selectedPokemon?.id +
                  ".png"
                }
              />
              <Image
                src={
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/" +
                  selectedPokemon?.id +
                  ".png"
                }
              />
            </Row>
            <Descriptions bordered size="middle">
              <Descriptions.Item label="Name">
                {selectedPokemon?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Growth Time">
                {selectedPokemon?.height}
              </Descriptions.Item>
              <Descriptions.Item label="Max Harvest">
                {selectedPokemon?.base_experience}
              </Descriptions.Item>
              <Descriptions.Item label="Natural gift power">
                {selectedPokemon?.weight}
              </Descriptions.Item>
              <Descriptions.Item label="Size">
                {selectedPokemon?.size}
              </Descriptions.Item>
              <Descriptions.Item label="Smoothness">
                {selectedPokemon?.smoothness}
              </Descriptions.Item>
              <Descriptions.Item label="Soil dryness">
                {selectedPokemon?.soil_dryness}
              </Descriptions.Item>
            </Descriptions>
          </Drawer>
        </>
      )}
    </>
  );
};

export default PokemonList;
