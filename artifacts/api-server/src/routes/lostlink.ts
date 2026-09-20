import { Router, type IRouter } from "express";
import {
  CreateClaimBody,
  CreateHandoverBody,
  CreateItemBody,
  CreateMatchBody,
  GetItemParams,
  ListItemsQueryParams,
  VerifyClaimBody,
  VerifyClaimParams,
} from "@workspace/api-zod";
import { randomUUID } from "node:crypto";

type Item = {
  id: string;
  type: "lost" | "found";
  category: string;
  name: string;
  brand: string;
  model?: string;
  color: string;
  location: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  status:
    | "LOST"
    | "FOUND"
    | "MATCHED"
    | "VERIFICATION_PENDING"
    | "VERIFIED"
    | "RESOLVED";
  createdAt: string;
  ownerName?: string;
  privateClueCount?: number;
};

type Match = {
  id: string;
  lostItem: Item;
  foundItem: Item;
  similarity: number;
  factors: string[];
  status: "POTENTIAL" | "VERIFICATION_PENDING" | "VERIFIED" | "RESOLVED";
};

type Claim = {
  id: string;
  item: Item;
  claimantName: string;
  verificationStatus: "PENDING" | "PASSED" | "FAILED" | "ADDITIONAL_REVIEW";
  identityStatus: "VERIFIED" | "UNVERIFIED";
  evidenceMatched?: string[];
  createdAt: string;
  privateClues: string[];
};

const now = new Date().toISOString();
const image = "";

const items: Item[] = [
  {
    id: "lost-lenovo",
    type: "lost",
    category: "Laptop",
    name: "ThinkPad laptop",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    color: "Black",
    location: "Central Library",
    date: "2026-09-18",
    time: "14:30",
    description: "Black Lenovo laptop lost near the second-floor study desks.",
    imageUrl: image,
    status: "MATCHED",
    createdAt: now,
    ownerName: "Aarav Mehta",
    privateClueCount: 3,
  },
  {
    id: "found-lenovo",
    type: "found",
    category: "Laptop",
    name: "Lenovo laptop",
    brand: "Lenovo",
    model: "ThinkPad",
    color: "Black",
    location: "Central Library",
    date: "2026-09-18",
    time: "15:10",
    description: "Black Lenovo laptop found beside a library charging station.",
    imageUrl: image,
    status: "VERIFICATION_PENDING",
    createdAt: now,
    ownerName: "Maya Rao",
  },
  {
    id: "lost-wallet",
    type: "lost",
    category: "Wallet",
    name: "Slim leather wallet",
    brand: "Fossil",
    color: "Black",
    location: "Student Union",
    date: "2026-09-17",
    time: "12:15",
    description: "Small black leather wallet lost near the west entrance.",
    imageUrl: image,
    status: "LOST",
    createdAt: now,
    ownerName: "Diya Kapoor",
    privateClueCount: 2,
  },
  {
    id: "found-wallet",
    type: "found",
    category: "Wallet",
    name: "Black wallet",
    brand: "Fossil",
    color: "Black",
    location: "Student Union",
    date: "2026-09-17",
    time: "12:40",
    description: "Black leather wallet found on a bench by the west entrance.",
    imageUrl: image,
    status: "FOUND",
    createdAt: now,
    ownerName: "Nikhil Shah",
  },
  {
    id: "lost-airpods",
    type: "lost",
    category: "Earbuds",
    name: "AirPods Pro",
    brand: "Apple",
    color: "White",
    location: "Engineering Quad",
    date: "2026-09-16",
    time: "18:20",
    description: "White AirPods Pro in a translucent case, last seen after class.",
    imageUrl: image,
    status: "RESOLVED",
    createdAt: now,
    ownerName: "Rohan Iyer",
    privateClueCount: 2,
  },
  {
    id: "found-airpods",
    type: "found",
    category: "Earbuds",
    name: "AirPods",
    brand: "Apple",
    color: "White",
    location: "Engineering Quad",
    date: "2026-09-16",
    time: "18:45",
    description: "White Apple earbuds found on the steps outside the engineering building.",
    imageUrl: image,
    status: "RESOLVED",
    createdAt: now,
    ownerName: "Rohan Iyer",
  },
];

const clues: Record<string, string[]> = {
  "lost-lenovo": ["red arduino sticker", "scratch on left corner", "blue mouse"],
  "lost-wallet": ["library card", "small stitched star"],
  "lost-airpods": ["tiny green mark", "engraved initials"],
};

const publicItem = (item: Item): Item => {
  const { privateClues: _privateClues, ...safeItem } = item as Item & {
    privateClues?: string[];
  };
  return {
    ...safeItem,
    privateClueCount: item.privateClueCount,
  };
};

const findItem = (id: string) => items.find((item) => item.id === id);

const makeMatch = (lostItem: Item, foundItem: Item, similarity: number): Match => {
  const factors = ["Same category", "Same brand", "Similar color"];
  if (lostItem.location === foundItem.location) factors.push("Nearby location");
  if (lostItem.description.split(" ").some((word) => foundItem.description.toLowerCase().includes(word.toLowerCase()))) {
    factors.push("Similar description");
  }
  return {
    id: `match-${lostItem.id}-${foundItem.id}`,
    lostItem: publicItem(lostItem),
    foundItem: publicItem(foundItem),
    similarity,
    factors,
    status: lostItem.status === "RESOLVED" ? "RESOLVED" : "VERIFICATION_PENDING",
  };
};

const matches: Match[] = [
  makeMatch(items[0], items[1], 91),
  makeMatch(items[2], items[3], 86),
  makeMatch(items[4], items[5], 94),
];

const claims: Claim[] = [
  {
    id: "claim-fake",
    item: publicItem(items[1]),
    claimantName: "Unverified claimant",
    verificationStatus: "FAILED",
    identityStatus: "UNVERIFIED",
    evidenceMatched: [],
    createdAt: now,
    privateClues: clues["lost-lenovo"],
  },
  {
    id: "claim-owner",
    item: publicItem(items[1]),
    claimantName: "Aarav Mehta",
    verificationStatus: "PASSED",
    identityStatus: "VERIFIED",
    evidenceMatched: ["Private detail matched", "Previous photo matched"],
    createdAt: now,
    privateClues: clues["lost-lenovo"],
  },
  {
    id: "claim-pending",
    item: publicItem(items[3]),
    claimantName: "Pending claimant",
    verificationStatus: "PENDING",
    identityStatus: "VERIFIED",
    createdAt: now,
    privateClues: clues["lost-wallet"],
  },
];

const safeClaim = (claim: Claim) => {
  const { privateClues: _privateClues, ...safe } = claim;
  return safe;
};

const router: IRouter = Router();

router.get("/items", (req, res) => {
  const query = ListItemsQueryParams.parse(req.query);
  let result = items;
  if (query.type) result = result.filter((item) => item.type === query.type);
  if (query.status) result = result.filter((item) => item.status === query.status);
  if (query.search) {
    const needle = query.search.toLowerCase();
    result = result.filter((item) =>
      [item.name, item.brand, item.category, item.location, item.description]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }
  res.json(result.map(publicItem));
});

router.post("/items", (req, res) => {
  const input = CreateItemBody.parse(req.body);
  const { privateClues, ...publicInput } = input;
  const item: Item = {
    id: `item-${randomUUID()}`,
    ...publicInput,
    imageUrl: publicInput.imageUrl ?? "",
    status: publicInput.type === "lost" ? "LOST" : "FOUND",
    createdAt: new Date().toISOString(),
    ownerName: "You",
    privateClueCount: privateClues?.length ?? 0,
  };
  items.unshift(item);
  if (publicInput.type === "lost" && privateClues?.length) clues[item.id] = privateClues;
  res.status(201).json(publicItem(item));
});

router.get("/items/:id", (req, res) => {
  const { id } = GetItemParams.parse(req.params);
  const item = findItem(id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.json(publicItem(item));
});

router.get("/matches", (_req, res) => {
  res.json(matches.map((match) => ({
    ...match,
    lostItem: publicItem(match.lostItem),
    foundItem: publicItem(match.foundItem),
  })));
});

router.post("/matches", (req, res) => {
  const input = CreateMatchBody.parse(req.body);
  const lost = findItem(input.lostItemId);
  const found = findItem(input.foundItemId);
  if (!lost || !found) return res.status(404).json({ error: "Both items are required" });
  const match = makeMatch(lost, found, 88);
  matches.unshift(match);
  lost.status = "MATCHED";
  found.status = "VERIFICATION_PENDING";
  return res.status(201).json(match);
});

router.get("/claims", (_req, res) => {
  res.json(claims.map(safeClaim));
});

router.post("/claims", (req, res) => {
  const input = CreateClaimBody.parse(req.body);
  const item = findItem(input.itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  const linkedMatch = matches.find((match) => match.foundItem.id === item.id);
  const linkedLostItem = linkedMatch ? findItem(linkedMatch.lostItem.id) : undefined;
  const claim: Claim = {
    id: `claim-${randomUUID()}`,
    item: publicItem(item),
    claimantName: "You",
    verificationStatus: "PENDING",
    identityStatus: input.identityEmail?.endsWith(".edu") ? "VERIFIED" : "UNVERIFIED",
    createdAt: new Date().toISOString(),
    privateClues: clues[linkedLostItem?.id ?? item.id] ?? [],
  };
  claims.unshift(claim);
  item.status = "VERIFICATION_PENDING";
  return res.status(201).json(safeClaim(claim));
});

router.post("/claims/:id/verify", (req, res) => {
  const { id } = VerifyClaimParams.parse(req.params);
  const input = VerifyClaimBody.parse(req.body);
  const claim = claims.find((candidate) => candidate.id === id);
  if (!claim) return res.status(404).json({ error: "Claim not found" });
  const normalized = input.evidence.toLowerCase();
  const matched = claim.privateClues.filter((clue) => normalized.includes(clue));
  if (matched.length >= Math.max(1, Math.ceil(claim.privateClues.length / 2))) {
    claim.verificationStatus = "PASSED";
    claim.evidenceMatched = ["Private detail matched", "Previous photo matched"];
    claim.item.status = "VERIFIED";
    return res.json({
      status: "PASSED",
      message: "Ownership verification passed.",
      evidenceMatched: claim.evidenceMatched,
    });
  }
  claim.verificationStatus = matched.length ? "ADDITIONAL_REVIEW" : "FAILED";
  claim.evidenceMatched = [];
  return res.json({
    status: claim.verificationStatus,
    message: matched.length
      ? "Additional verification is required before a safe handover."
      : "Ownership verification failed. The information provided did not sufficiently match the private evidence.",
    evidenceMatched: [],
  });
});

router.post("/handover", (req, res) => {
  const input = CreateHandoverBody.parse(req.body);
  const item = findItem(input.itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  const completed = input.action === "CONFIRM";
  if (completed) {
    item.status = "RESOLVED";
    const related = matches.find((match) => match.foundItem.id === item.id || match.lostItem.id === item.id);
    if (related) {
      related.status = "RESOLVED";
      const relatedLost = findItem(related.lostItem.id);
      const relatedFound = findItem(related.foundItem.id);
      if (relatedLost) relatedLost.status = "RESOLVED";
      if (relatedFound) relatedFound.status = "RESOLVED";
    }
  }
  return res.json({
    id: `handover-${item.id}`,
    item: publicItem(item),
    status: completed ? "COMPLETED" : "ARRANGED",
    nextStep: completed ? "Item successfully returned." : "Meet in a public campus location and confirm the handover together.",
  });
});

router.get("/dashboard", (_req, res) => {
  const returned = items.filter((item) => item.status === "RESOLVED").length / 2;
  res.json({
    stats: {
      reported: items.length,
      matches: matches.length,
      pendingClaims: claims.filter((claim) => claim.verificationStatus === "PENDING" || claim.verificationStatus === "ADDITIONAL_REVIEW").length,
      returned,
    },
    recentItems: items.slice(0, 5).map(publicItem),
    recentActivity: [
      { id: "activity-1", title: "Potential match found", description: "Black Lenovo laptop near Central Library", timestamp: "12 min ago", type: "match" },
      { id: "activity-2", title: "Ownership verified", description: "Aarav Mehta passed the private evidence challenge", timestamp: "1 hr ago", type: "verified" },
      { id: "activity-3", title: "Item returned", description: "AirPods Pro safely returned to their owner", timestamp: "Yesterday", type: "resolved" },
    ],
  });
});

router.get("/admin/metrics", (_req, res) => {
  res.json({
    totals: {
      lost: items.filter((item) => item.type === "lost").length,
      found: items.filter((item) => item.type === "found").length,
      matches: matches.length,
      pending: claims.filter((claim) => claim.verificationStatus === "PENDING" || claim.verificationStatus === "ADDITIONAL_REVIEW").length,
      returned: items.filter((item) => item.status === "RESOLVED").length / 2,
    },
    categories: [
      { category: "Laptops", count: 2 },
      { category: "Wallets", count: 2 },
      { category: "Earbuds", count: 2 },
    ],
    trend: [
      { label: "Mon", lost: 2, found: 1 },
      { label: "Tue", lost: 1, found: 2 },
      { label: "Wed", lost: 3, found: 2 },
      { label: "Thu", lost: 2, found: 3 },
      { label: "Fri", lost: 4, found: 3 },
      { label: "Sat", lost: 2, found: 4 },
      { label: "Sun", lost: 3, found: 2 },
    ],
  });
});

export default router;