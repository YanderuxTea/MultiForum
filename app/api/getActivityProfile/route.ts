import { filterType } from "@/components/ui/profiles/BlockActivityUser";
import { ReactionType } from "@/context/CategoriesContext";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@/prisma/generated/enums";
import { JSONContent } from "@tiptap/core";
import { NextResponse } from "next/server";
export interface IProfileReaction {
  id: string;
  createdAt: Date;
  reactionType: ReactionType;
  messagesPosts: {
    Posts: {
      id: string;
      title: string;
      SubCategories: {
        id: string;
      };
    };
  };
  fromUser: {
    login: string;
  };
  toUser: {
    login: string;
  };
}
export interface IProfileReactionsMessage {
  id: string;
  createdAt: Date;
  reactionType: ReactionType;
  fromUser: {
    id: string;
    login: string;
    role: string;
    avatar: string | null;
  };
}
export interface IProfileMessage {
  id: string;
  createdAt: Date;
  reactions: IProfileReactionsMessage[];
  Posts: {
    id: string;
    _count: {
      MessagesPosts: number;
    };
    title: string;
    locked: boolean;
    SubCategories: {
      id: string;
      title: string;
    };
  };
  text: JSONContent;
}
export interface IProfileStatus {
  id: string;
  text: string;
  createdAt: Date;
}
export interface IProfileActivityUser {
  id: string;
  activityType: ActivityType;
  mess: IProfileMessage | null;
  status: IProfileStatus | null;
  reaction: IProfileReaction | null;
}

export interface IProfileActivity {
  id: string;
  login: string;
  role: string;
  avatar: string | null;
  activityUser: IProfileActivityUser[];
  _count: {
    activityUser: number;
  };
}
export async function POST(req: Request) {
  const body = await req.json();
  const {
    login,
    pageNumber,
    filterType,
  }: { login: string; pageNumber: number; filterType: filterType } = body;
  const pageSize = 25;
  if (filterType === "all") {
    const activity = await prisma.users.findUnique({
      where: { login: login },
      select: {
        _count: {
          select: {
            activityUser: {
              where: {
                OR: [
                  {
                    mess: {
                      AND: [
                        { Posts: { SubCategories: { visible: true } } },
                        {
                          Posts: {
                            SubCategories: { Categories: { visible: "All" } },
                          },
                        },
                      ],
                    },
                  },
                  {
                    reaction: {
                      AND: [
                        {
                          messagesPosts: {
                            Posts: { SubCategories: { visible: true } },
                          },
                        },
                        {
                          messagesPosts: {
                            Posts: {
                              SubCategories: { Categories: { visible: "All" } },
                            },
                          },
                        },
                        {
                          OR: [
                            { toUser: { login: login } },
                            { fromUser: { login: login } },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    activityType: "status",
                  },
                ],
              },
            },
          },
        },
        login: true,
        avatar: true,
        role: true,
        activityUser: {
          where: {
            OR: [
              {
                mess: {
                  AND: [
                    { Posts: { SubCategories: { visible: true } } },
                    {
                      Posts: {
                        SubCategories: { Categories: { visible: "All" } },
                      },
                    },
                  ],
                },
              },
              {
                reaction: {
                  AND: [
                    {
                      messagesPosts: {
                        Posts: { SubCategories: { visible: true } },
                      },
                    },
                    {
                      messagesPosts: {
                        Posts: {
                          SubCategories: { Categories: { visible: "All" } },
                        },
                      },
                    },
                    {
                      OR: [
                        { toUser: { login: login } },
                        { fromUser: { login: login } },
                      ],
                    },
                  ],
                },
              },
              {
                activityType: "status",
              },
            ],
          },
          select: {
            id: true,
            activityType: true,
            reaction: {
              where: {
                AND: [
                  {
                    messagesPosts: {
                      Posts: { SubCategories: { visible: true } },
                    },
                  },
                  {
                    messagesPosts: {
                      Posts: {
                        SubCategories: { Categories: { visible: "All" } },
                      },
                    },
                  },
                  {
                    OR: [
                      { toUser: { login: login } },
                      { fromUser: { login: login } },
                    ],
                  },
                ],
              },
              select: {
                id: true,
                createdAt: true,
                fromUser: { select: { login: true } },
                toUser: { select: { login: true } },
                reactionType: true,
                messagesPosts: {
                  select: {
                    Posts: {
                      select: {
                        id: true,
                        title: true,
                        SubCategories: {
                          select: {
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            mess: {
              where: {
                AND: [
                  { Posts: { SubCategories: { visible: true } } },
                  {
                    Posts: {
                      SubCategories: { Categories: { visible: "All" } },
                    },
                  },
                ],
              },
              select: {
                id: true,
                createdAt: true,
                text: true,
                reactions: {
                  select: {
                    id: true,
                    createdAt: true,
                    reactionType: true,
                    fromUser: {
                      select: {
                        id: true,
                        login: true,
                        role: true,
                        avatar: true,
                      },
                    },
                  },
                },
                Posts: {
                  select: {
                    locked: true,
                    title: true,
                    id: true,
                    SubCategories: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                    _count: {
                      select: {
                        MessagesPosts: true,
                      },
                    },
                  },
                },
              },
            },
            status: {
              select: {
                text: true,
                id: true,
                createdAt: true,
              },
            },
          },
          take: pageSize,
          skip: pageNumber * pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ ok: true, activity: activity });
  } else if (filterType === "messages") {
    const activity = await prisma.users.findUnique({
      where: { login: login },
      select: {
        _count: {
          select: {
            activityUser: {
              where: {
                mess: {
                  AND: [
                    { Posts: { SubCategories: { visible: true } } },
                    {
                      Posts: {
                        SubCategories: { Categories: { visible: "All" } },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        login: true,
        avatar: true,
        role: true,
        activityUser: {
          where: {
            mess: {
              AND: [
                { Posts: { SubCategories: { visible: true } } },
                {
                  Posts: {
                    SubCategories: { Categories: { visible: "All" } },
                  },
                },
              ],
            },
          },
          select: {
            id: true,
            activityType: true,
            mess: {
              where: {
                AND: [
                  { Posts: { SubCategories: { visible: true } } },
                  {
                    Posts: {
                      SubCategories: { Categories: { visible: "All" } },
                    },
                  },
                ],
              },
              select: {
                id: true,
                createdAt: true,
                text: true,
                reactions: {
                  select: {
                    id: true,
                    createdAt: true,
                    reactionType: true,
                    fromUser: {
                      select: {
                        id: true,
                        login: true,
                        role: true,
                        avatar: true,
                      },
                    },
                  },
                },
                Posts: {
                  select: {
                    locked: true,
                    title: true,
                    id: true,
                    SubCategories: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                    _count: {
                      select: {
                        MessagesPosts: true,
                      },
                    },
                  },
                },
              },
            },
            reaction: { select: { id: true } },
            status: {
              select: {
                id: true,
              },
            },
          },
          take: pageSize,
          skip: pageNumber * pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ ok: true, activity: activity });
  } else if (filterType === "statuses") {
    const activity = await prisma.users.findUnique({
      where: { login: login },
      select: {
        _count: {
          select: {
            activityUser: {
              where: {
                activityType: "status",
              },
            },
          },
        },
        login: true,
        avatar: true,
        role: true,
        activityUser: {
          where: {
            activityType: "status",
          },
          select: {
            id: true,
            activityType: true,
            mess: {
              where: {
                AND: [
                  { Posts: { SubCategories: { visible: true } } },
                  {
                    Posts: {
                      SubCategories: { Categories: { visible: "All" } },
                    },
                  },
                ],
              },
              select: {
                id: true,
              },
            },
            reaction: { select: { id: true } },
            status: {
              select: {
                text: true,
                id: true,
                createdAt: true,
              },
            },
          },
          take: pageSize,
          skip: pageNumber * pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ ok: true, activity: activity });
  } else if (filterType === "reactions") {
    const activity = await prisma.users.findUnique({
      where: { login: login },
      select: {
        _count: {
          select: {
            activityUser: {
              where: {
                reaction: {
                  AND: [
                    {
                      messagesPosts: {
                        Posts: { SubCategories: { visible: true } },
                      },
                    },
                    {
                      messagesPosts: {
                        Posts: {
                          SubCategories: { Categories: { visible: "All" } },
                        },
                      },
                    },
                    {
                      OR: [
                        { toUser: { login: login } },
                        { fromUser: { login: login } },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        login: true,
        avatar: true,
        role: true,
        activityUser: {
          where: {
            reaction: {
              AND: [
                {
                  messagesPosts: {
                    Posts: { SubCategories: { visible: true } },
                  },
                },
                {
                  messagesPosts: {
                    Posts: {
                      SubCategories: { Categories: { visible: "All" } },
                    },
                  },
                },
                {
                  OR: [
                    { toUser: { login: login } },
                    { fromUser: { login: login } },
                  ],
                },
              ],
            },
          },

          select: {
            id: true,
            activityType: true,
            reaction: {
              where: {
                AND: [
                  {
                    messagesPosts: {
                      Posts: { SubCategories: { visible: true } },
                    },
                  },
                  {
                    messagesPosts: {
                      Posts: {
                        SubCategories: { Categories: { visible: "All" } },
                      },
                    },
                  },
                  {
                    OR: [
                      { toUser: { login: login } },
                      { fromUser: { login: login } },
                    ],
                  },
                ],
              },
              select: {
                id: true,
                createdAt: true,
                fromUser: { select: { login: true } },
                toUser: { select: { login: true } },
                reactionType: true,
                messagesPosts: {
                  select: {
                    Posts: {
                      select: {
                        id: true,
                        title: true,
                        SubCategories: {
                          select: {
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            mess: {
              select: { id: true },
            },
            status: {
              select: { id: true },
            },
          },
          take: pageSize,
          skip: pageNumber * pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ ok: true, activity: activity });
  }
}
