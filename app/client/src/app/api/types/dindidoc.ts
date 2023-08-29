export type Dindidoc = {
  "version": "0.1.0",
  "name": "dindidoc",
  "instructions": [
    {
      "name": "createContract",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "terms",
          "type": "string"
        },
        {
          "name": "ownersName",
          "type": "string"
        }
      ]
    },
    {
      "name": "transferContract",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        },
        {
          "name": "newOwnerName",
          "type": "string"
        }
      ]
    },
    {
      "name": "addNotes",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newNote",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "chainOfOwnership",
            "type": "string"
          },
          {
            "name": "terms",
            "type": "string"
          },
          {
            "name": "notes",
            "type": "string"
          },
          {
            "name": "signature1",
            "type": "string"
          },
          {
            "name": "signature2",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MissingAuthority"
    }
  ]
};

export const IDL: Dindidoc = {
  "version": "0.1.0",
  "name": "dindidoc",
  "instructions": [
    {
      "name": "createContract",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "terms",
          "type": "string"
        },
        {
          "name": "ownersName",
          "type": "string"
        }
      ]
    },
    {
      "name": "transferContract",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        },
        {
          "name": "newOwnerName",
          "type": "string"
        }
      ]
    },
    {
      "name": "addNotes",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newNote",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "chainOfOwnership",
            "type": "string"
          },
          {
            "name": "terms",
            "type": "string"
          },
          {
            "name": "notes",
            "type": "string"
          },
          {
            "name": "signature1",
            "type": "string"
          },
          {
            "name": "signature2",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MissingAuthority"
    }
  ]
};
