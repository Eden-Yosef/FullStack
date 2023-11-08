using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace newProject.Models;

public partial class Exam
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Teacher { get; set; }

    public string? Date { get; set; }

    public string? StartTime { get; set; }

    public int? TotalTime { get; set; }

    public string? TypeExam { get; set; }

    public string? Questions { get; set; }

    public string? Grades { get; set; }

    public virtual ICollection<Grade> GradesNavigation { get; set; } = new List<Grade>();

    public virtual ICollection<Question> QuestionsNavigation { get; set; } = new List<Question>();
}
