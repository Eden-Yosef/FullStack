using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace newProject.Models;

public partial class Question
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public int Id { get; set; }

    public int? IdExam { get; set; }

    public string? Answers { get; set; }

    public string? QuestionText { get; set; }

    public virtual ICollection<Answer> AnswersNavigation { get; set; } = new List<Answer>();

    public virtual Exam? IdExamNavigation { get; set; }
}
