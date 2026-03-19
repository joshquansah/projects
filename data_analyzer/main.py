import pandas as pd
from fastapi import FastAPI

from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
load_dotenv()
DB_URL = os.getenv("DB_URL")
app = FastAPI()

engine = create_engine(f"postgresql://{DB_URL}")


def home_points(row):
    if row.home_score > row.away_score:
        return 3
    elif row.home_score < row.away_score:
        return 0
    elif row.home_score == row.away_score:
        return 1
    return None


def away_points(row):
    if row.home_score < row.away_score:
        return 3
    elif row.home_score > row.away_score:
        return 0
    elif row.home_score == row.away_score:
        return 1
    return None


def home_results(row):
    if row.home_score > row.away_score:
        return "W"
    elif row.home_score < row.away_score:
        return "L"
    elif row.home_score == row.away_score:
        return "D"
    return None


def away_results(row):
    if row.home_score < row.away_score:
        return "W"
    elif row.home_score > row.away_score:
        return "L"
    elif row.home_score == row.away_score:
        return "D"
    return None
@app.get("/stats/{league}/{year}/table")
def get_table(league, year):
    df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))


    df["home_points"] = df.apply(home_points, axis=1)
    df["away_points"] = df.apply(away_points, axis=1)
    df["home_results"] = df.apply(home_results, axis=1)
    df["away_results"] = df.apply(away_results, axis=1)
    wins = df[df.home_points == 3].groupby("home_team").size() + df[df.away_points == 3].groupby("away_team").size()
    draws = df[df.home_points == 1].groupby("home_team").size() + df[df.away_points == 1].groupby("away_team").size()
    losses = df[df.home_points == 0].groupby("home_team").size() + df[df.away_points == 0].groupby("away_team").size()

    goals_for = df.groupby("home_team").home_score.sum() + df.groupby("away_team").away_score.sum()
    goals_against = df.groupby("home_team").away_score.sum() + df.groupby("away_team").home_score.sum()
    goaldiff = goals_for - goals_against
    played = df.groupby("home_team").size() + df.groupby("away_team").size()
    point_table = df.groupby("home_team").home_points.sum() + df.groupby("away_team").away_points.sum()

    table = pd.DataFrame({"Pld": played,
                          "W": wins,
                          "D": draws,
                          "L": losses,
                          "GF": goals_for,
                          "GA": goals_against,
                          "GD": goaldiff,
                          "Pts": point_table},
                         )
    table = table.sort_values(by=["Pts", "GD"], ascending=False)
    table["Pos"] = range(1, len(table) + 1)
    return table.reset_index().rename(columns={"home_team": "team"}).to_dict(orient="records")
@app.get("/stats/{league}/{year}/goals")
def get_goals(league, year):
    df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))
    goals = df.groupby("home_team").home_score.sum() + df.groupby("away_team").away_score.sum()
    goals_against = df.groupby("home_team").away_score.sum() + df.groupby("away_team").home_score.sum()
    goal_ratio = goals / goals_against
    clean_sheets = (df.groupby("home_team").size() - df[df["away_score"] != 0].groupby("home_team").size()) + (df.groupby("away_team").size() - df[df["home_score"] != 0].groupby("away_team").size())
    goals_per_game = goals / (df.groupby("home_team").size() + df.groupby("away_team").size())
    goal_stats = pd.DataFrame({"Goals Scored": goals,
                               "Goals Conceded": goals_against,
                               "Ratio": goal_ratio,
                               "Goals per Game": goals_per_game,
                               "Clean Sheets": clean_sheets})
    goals = goals.sort_values(ascending=False)
    goals_against = goals_against.sort_values(ascending=False)
    goal_ratio = goal_ratio.sort_values(ascending=False)
    goals_per_game = goals_per_game.sort_values(ascending=False)
    clean_sheets = clean_sheets.sort_values(ascending=False)

    return {"Goals Scored": goals.to_dict(),
            "Goals Conceded": goals_against.to_dict(),
            "Goals Ratio": goal_ratio.to_dict(),
            "Goals per Game": goals_per_game.to_dict(),
            "Clean Sheets": clean_sheets.to_dict(),
            }
@app.get("/stats/{league}/{year}/homevsaway")
def get_table(league, year):
    df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))


    df["home_points"] = df.apply(home_points, axis=1)
    df["away_points"] = df.apply(away_points, axis=1)
    df["home_results"] = df.apply(home_results, axis=1)
    df["away_results"] = df.apply(away_results, axis=1)
    wins = df[df.home_points == 3].groupby("home_team").size() + df[df.away_points == 3].groupby("away_team").size()
    draws = df[df.home_points == 1].groupby("home_team").size() + df[df.away_points == 1].groupby("away_team").size()
    losses = df[df.home_points == 0].groupby("home_team").size() + df[df.away_points == 0].groupby("away_team").size()

    goals_for = df.groupby("home_team").home_score.sum() + df.groupby("away_team").away_score.sum()
    goals_against = df.groupby("home_team").away_score.sum() + df.groupby("away_team").home_score.sum()
    goaldiff = goals_for - goals_against
    played = df.groupby("home_team").size() + df.groupby("away_team").size()
    point_table = df.groupby("home_team").home_points.sum() + df.groupby("away_team").away_points.sum()

    table = pd.DataFrame({"Pld": played,
                          "W": wins,
                          "D": draws,
                          "L": losses,
                          "GF": goals_for,
                          "GA": goals_against,
                          "GD": goaldiff,
                          "Pts": point_table},
                         )
    table = table.sort_values(by=["Pts", "GD"], ascending=False)
    table["Pos"] = range(1, len(table) + 1)
    return table.reset_index().rename(columns={"home_team": "team"}).to_dict(orient="records")