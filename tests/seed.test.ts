// testing tutorial week 12
// unit test for the seed function
// we mock the db so no real sqlite touched
// two scenarios table empty should insert and table has rows should not insert

import { db } from "../db/client";
import { seedApplicationsIfEmpty } from "../db/seed";

// replace the real db import with a fake that has select and insert as mock functions
jest.mock("../db/client", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

// telling typescript our mocked db has mock function types so we can call mockReturnValue etc
const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe("seedApplicationsIfEmpty", () => {
  // reset mock state before each test so one test does not pollute the next
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts applications when the table is empty", async () => {
    // fake the insert chain db.insert(table).values(rows)
    const mockValues = jest.fn().mockResolvedValue(undefined);
    // fake the select chain db.select().from(table) returning empty array
    const mockFrom = jest.fn().mockResolvedValue([]);

    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedApplicationsIfEmpty();

    // insert should have been called because table was empty
    expect(mockDb.insert).toHaveBeenCalled();
    // values should have received our three seeds with the right companies
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ company: "Google" }),
        expect.objectContaining({ company: "Meta" }),
        expect.objectContaining({ company: "Stripe" }),
      ]),
    );
  });

  it("does nothing when applications already exist", async () => {
    // fake select returning a non empty array so our guard kicks in
    const mockFrom = jest.fn().mockResolvedValue([
      {
        id: 1,
        company: "Existing",
        category: "Developer",
        date: "2026-04-01",
        count: 0,
      },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedApplicationsIfEmpty();

    // insert should never have be called because table had rows
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
