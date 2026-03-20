import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
load_dotenv()
DB_URL = os.getenv("DB_URL")
app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"])
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
    wins = (df[df.home_points == 3].groupby("home_team").size() + df[df.away_points == 3].groupby("away_team").size()).fillna(0)
    draws = (df[df.home_points == 1].groupby("home_team").size() + df[df.away_points == 1].groupby("away_team").size()).fillna(0)
    losses = (df[df.home_points == 0].groupby("home_team").size() + df[df.away_points == 0].groupby("away_team").size()).fillna(0)

    goals_for = (df.groupby("home_team").home_score.sum() + df.groupby("away_team").away_score.sum()).fillna(0)
    goals_against = (df.groupby("home_team").away_score.sum() + df.groupby("away_team").home_score.sum()).fillna(0)
    goaldiff = goals_for - goals_against
    played = (df.groupby("home_team").size() + df.groupby("away_team").size()).fillna(0)
    point_table = (df.groupby("home_team").home_points.sum() + df.groupby("away_team").away_points.sum()).fillna(0)

    table = pd.DataFrame({"Pld": played,
                          "W": wins,
                          "D": draws,
                          "L": losses,
                          "GF": goals_for,
                          "GA": goals_against,
                          "GD": goaldiff,
                          "Pts": point_table},
                         )
    if int(year) == 2023:
        deductions = {"Everton": 8}
        for team, pts in deductions.items():
            if team in table.index:
                table.loc[team, "Pts"] -= pts
    table = table.sort_values(by=["Pts", "GD"], ascending=False)
    table["Pos"] = range(1, len(table) + 1)

    table = table.reset_index().rename(columns={"home_team": "team"})
    table = table[["Pos", "team", "Pld", "W", "D", "L", "GF", "GA", "GD", "Pts"]]
    return table.to_dict(orient="records")
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
    goal_ratio = goal_ratio.sort_values(ascending=False).round(1)
    goals_per_game = goals_per_game.sort_values(ascending=False).round(1)
    clean_sheets = clean_sheets.sort_values(ascending=False)

    return {"Goals Scored": [{"team": k, "Goals Scored": v} for k, v in goals.items()],
            "Goals Conceded": [{"team": k, "Goals Conceded": v} for k, v in goals_against.items()],
            "Goals Ratio": [{"team": k, "Goals Ratio": v} for k, v in goal_ratio.items()],
            "Goals per Game": [{"team": k, "Goals per Game": v} for k, v in goals_per_game.items()],
            "Clean Sheets": [{"team": k, "Clean Sheets": v} for k, v in clean_sheets.items()],
            }
@app.get("/stats/{league}/{year}/homevsaway")
def get_homevsaway(league, year):
    try:
        df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))


        df["home_points"] = df.apply(home_points, axis=1)
        df["away_points"] = df.apply(away_points, axis=1)
        df["home_results"] = df.apply(home_results, axis=1)
        df["away_results"] = df.apply(away_results, axis=1)
        home_wins = df[df.home_points == 3].groupby("home_team").size()
        away_wins = df[df.away_points == 3].groupby("away_team").size()
        home_win_pct = (home_wins / 19) * 100
        away_win_pct = (away_wins / 19) * 100
        home_goals = df.groupby("home_team").home_score.sum() + (df.groupby("away_team").away_score.sum() - df.groupby("away_team").away_score.sum())
        away_goals = df.groupby("away_team").away_score.sum() + (df.groupby("home_team").home_score.sum() - df.groupby("home_team").home_score.sum())

        home_pts =  df.groupby("home_team").home_points.sum() + (df.groupby("away_team").away_points.sum() - df.groupby("away_team").away_points.sum())
        away_pts = df.groupby("away_team").away_points.sum() + (df.groupby("home_team").home_points.sum() - df.groupby("home_team").home_points.sum())
        point_table = home_pts > away_pts
        drop = df.groupby("home_team").home_points.sum() - df.groupby("away_team").away_points.sum()
        table = pd.DataFrame({"Home wins": home_wins,
                              "Away wins": away_wins,
                              "Home pts": home_pts,
                              "Away pts": away_pts,
                              "Home win %": home_win_pct,
                              "Away win %": away_win_pct,
                              "Home away point diff": drop,
                              "Home Gls": home_goals,
                              "Away Gls": away_goals,
                              "Home advantage": point_table},
                             ).fillna(0)
        table = table.sort_values(by=["Home pts", "Away pts"], ascending=False)
        table["Pos"] = range(1, len(table) + 1)
        table["Home win %"] = table["Home win %"].round(1)
        table["Away win %"] = table["Away win %"].round(1)
        table["Home advantage"] = table["Home advantage"].map({True: "✅", False: "❌"})
        table.index.name = "team"
        table = table.reset_index()
        table = table[["Pos", "team", "Home wins", "Away wins", "Home pts", "Away pts", "Home win %", "Away win %", "Home away point diff", "Home Gls", "Away Gls", "Home advantage"]]
        return table.to_dict(orient="records")
    except Exception as e:

        return {"error": str(e)}
@app.get("/stats/{league}/{year}/form")
def get_form(league, year):
    df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))


    df["home_points"] = df.apply(home_points, axis=1)
    df["away_points"] = df.apply(away_points, axis=1)

    df = df.sort_values("match_date")

    home = df[["match_date", "home_team", "home_points"]].rename(
        columns={"home_team": "team", "home_points": "points"}
    )
    away = df[["match_date", "away_team", "away_points"]].rename(
        columns={"away_team": "team", "away_points": "points"}
    )
    combined = pd.concat([home, away]).sort_values("match_date")
    form = combined.groupby("team").tail(5)
    form["result"] = form["points"].map({3: "W", 1: "D", 0: "L"})
    form_summary = form.groupby("team").agg(
        form_string = ("result", lambda r: "".join(r)),
        form_points=("points", "sum")
    ).reset_index()
    form_summary = form_summary.sort_values("form_points", ascending=False)


    return form_summary.to_dict(orient="records")
@app.get("/stats/{league}/{year}/patterns")
def get_match_patterns(league, year):
    df = pd.read_sql("SELECT * FROM match WHERE league_id = %s AND season = %s", engine, params=(league, year))


    df["home_points"] = df.apply(home_points, axis=1)
    df["away_points"] = df.apply(away_points, axis=1)

    most_goals = (df.groupby("round").home_score.sum() + df.groupby("round").away_score.sum()).reset_index(name="goals")
    common_scorelines = df.groupby(["home_score", "away_score"]).size()
    most_goals["round"] = most_goals["round"].str.extract(r"(\d+)").astype(int)
    most_goals = most_goals.sort_values("round")
    common_scorelines = common_scorelines.reset_index(name="count").sort_values("count", ascending=False)
    total_draws = (df.home_score == df.away_score).sum()
    most_goals = most_goals.rename(columns = {"round": "MW"})
    return {
        "goals_by_matchweek": most_goals.to_dict(orient="records"),
        "common_scorelines": common_scorelines.to_dict(orient="records"),
        "total_draws": int(total_draws),
    }