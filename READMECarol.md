{
  "openapi": "3.0.0",
  "info": {
    "title": "API TijucaFit",
    "description": "Essa API tem como objetivo auxiliar na academia",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080/"
    }
  ],
  "paths": {
    "/api/test/user": {
      "get": {
        "summary": "Retorna dados para usuários autenticados. Teste",
        "description": "Esta rota é acessível apenas para usuários autenticados. Verifica se o usuário possui um token válido antes de retornar os dados, feita para teste",
        "tags": [
          "Usuário"
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "404": {
            "description": "Usuário não encontrado"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
    "/api/test/all": {
      "get": {
        "summary": "Retorna dados para usuários. Teste",
        "description": "Esta rota é acessível para todos os usuários. Feita para teste",
        "tags": [
          "Usuário"
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          }
        }
      }
    },
    "/api/mod": {
      "get": {
        "summary": "Retorna dados para usuários moderators. Teste",
        "description": "Esta rota é para que somente moderators entrem.",
        "tags": [
          "Usuário"
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          }
        }
      }
    },
    "/api/admin": {
      "get": {
        "summary": "Retorna dados para usuários admins. Teste",
        "description": "Esta rota é para que somente admins entrem. Feita para teste.",
        "tags": [
          "Usuário"
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          }
        }
      }
    },
    "/api/admin/allusers": {
      "get": {
        "summary": "Retorna dados somente para usuários admin ou moderators. ",
        "description": "Esta rota é para listar todos os usuários.",
        "tags": [
          "Usuário"
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados de imagem e usuários"
          },
          "500": {
            "description": "Erro ao buscar usuários, mostrando o erro."
          }
        }
      }
    },
    "/api/editUser": {
      "put": {
        "summary": "Edita dados de usuários autenticados.",
        "description": "Esta rota é para editar dados de usuário.",
        "tags": [
          "Usuário"
        ],
        "parameters": [
          {
            "name": "novoNome",
            "in": "query",
            "description": "Novo nome de usuário"
          }
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "401": {
            "description": "Caso tente acessar a próxima rota sem estar logado, retornará Não autorizado"
          },
          "403": {
            "description": "Caso tente acessar uma rota que não tem permissão ou não está logado, retornará Erro! ou Requer papel de administrador/moderator ou nenhum token fornecido"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
    "/api/admin/make-mod/{id}": {
      "put": {
        "summary": "Transforma usuário em moderador",
        "description": " Esta rota é usada por administradores para transformar um usuário em moderador.Requer autenticação de token de administrador.",
        "tags": [
          "Usuário"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID do usuário a ser transformado em moderador",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "401": {
            "description": "Caso tente acessar a próxima rota sem estar logado, retornará Não autorizado"
          },
          "403": {
            "description": "Caso tente acessar uma rota que não tem permissão ou não está logado, retornará Erro! ou Requer papel de administrador/moderator ou nenhum token fornecido"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
    "/api/admin/make-admin/{id}": {
      "put": {
        "summary": "Transforma usuário em admin",
        "description": " Esta rota é usada por administradores para transformar um usuário em moderador.Requer autenticação de token de administrador.",
        "tags": [
          "Usuário"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID do usuário a ser transformado em moderador",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "401": {
            "description": "Caso tente acessar a próxima rota sem estar logado, retornará Não autorizado"
          },
          "403": {
            "description": "Caso tente acessar uma rota que não tem permissão ou não está logado, retornará Erro! ou Requer papel de administrador/moderator ou nenhum token fornecido"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
    "/api/admin/remove-mod/{id}": {
      "put": {
        "summary": "Retira o papel do usuário de moderador",
        "description": " Esta rota é usada por administradores para retirar o papel de moderador de um usuário.Requer autenticação de token de administrador.",
        "tags": [
          "Usuário"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID do usuário a ser reditrado o papel de moderador",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "401": {
            "description": "Caso tente acessar a próxima rota sem estar logado, retornará Não autorizado"
          },
          "403": {
            "description": "Caso tente acessar uma rota que não tem permissão ou não está logado, retornará Erro! ou Requer papel de administrador/moderator ou nenhum token fornecido"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
    "/api/admin/remove-admin/{id}": {
      "put": {
        "summary": "Retira o papel do usuário de admin",
        "description": " Esta rota é usada por administradores para retirar o papel de admin de um usuário.Requer autenticação de token de administrador.",
        "tags": [
          "Usuário"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "description": "ID do usuário a ser retirado o papel de admin",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Retorna os dados"
          },
          "401": {
            "description": "Caso tente acessar a próxima rota sem estar logado, retornará Não autorizado"
          },
          "403": {
            "description": "Caso tente acessar uma rota que não tem permissão ou não está logado, retornará Erro! ou Requer papel de administrador/moderator ou nenhum token fornecido"
          },
          "500": {
            "description": "Erro ao buscar usuário ou papel de admin/moderator que exerce"
          }
        }
      }
    },
























    "/api/auth/signin": {
      "post": {
        "summary": "Autentica um usuário e retorna um token JWT",
        "description": "Esta rota é para autenticar um usuário usando email e senha e retorna um token JWT válido.",
        "tags": [
          "Usuário"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "O email do usuário"
                  },
                  "password": {
                    "type": "string",
                    "description": "A senha do usuário"
                  }
                },
                "required": [
                  "email",
                  "password"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login bem-sucedido. Retorna um token JWT.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "Token JWT para autorização de requisições futuras"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Solicitação inválida. Credenciais de login ausentes ou inválidas."
          },
          "500": {
            "description": "Erro interno do servidor ao tentar autenticar o usuário."
          }
        }
      }
    },
    "/api/auth/signout": {
      "post": {
        "summary": "Desloga do site",
        "description": "Esta rota é para um usuário sair do site",
        "tags": [
          "Usuário"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "description": "O email do usuário"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "O email do usuário"
                  },
                  "password": {
                    "type": "string",
                    "description": "A senha do usuário"
                  }
                },
                "required": [
                  "username",
                  "email",
                  "password",
                  "roles"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login bem-sucedido. Retorna um token JWT.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "Token JWT para autorização de requisições futuras"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Solicitação inválida. Credenciais de login ausentes ou inválidas."
          },
          "500": {
            "description": "Erro interno do servidor ao tentar autenticar o usuário."
          }
        }
      }
    },
    "/api/auth/signup": {
      "post": {
        "summary": "Cadastra um usuário e retorna um token JWT",
        "description": "Esta rota é para cadastrar um usuário usando username, email, e senha e retorna um token JWT válido.",
        "tags": [
          "Usuário"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "description": "O email do usuário"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "O email do usuário"
                  },
                  "roles": {
                    "type": "string",
                    "description": "O email do usuário"
                  },
                  "password": {
                    "type": "string",
                    "description": "A senha do usuário"
                  }
                },
                "required": [
                  "username",
                  "email",
                  "password",
                  "roles"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login bem-sucedido. Retorna um token JWT.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "Token JWT para autorização de requisições futuras"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Solicitação inválida. Credenciais de login ausentes ou inválidas."
          },
          "500": {
            "description": "Erro interno do servidor ao tentar autenticar o usuário."
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}